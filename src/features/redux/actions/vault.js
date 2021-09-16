import { HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE } from '../constants';
import BigNumber from 'bignumber.js';
import { MultiCall } from 'eth-multicall';
import { config } from '../../../config/config';
import { compound, isEmpty } from '../../../helpers/utils';
import { byDecimals, formatTvl } from '../../../helpers/format';
import { tokensByNetworkAddress } from '../../../config/tokens';

const gateManagerAbi = require('../../../config/abi/gatemanager.json');
const ecr20Abi = require('../../../config/abi/erc20.json');
const prizeStrategyAbi = require('../../../config/abi/prizestrategy.json');

const getPools = async (items, state, dispatch) => {
  console.log('redux getPools processing...');
  const web3 = state.walletReducer.rpc;
  const pools = { ...state.vaultReducer.pools }; // need new object ref so filters can re-run when any pool changes
  const prices = state.pricesReducer.prices;
  const apy = state.pricesReducer.apy;

  const multicall = [];
  const calls = [];
  const sponsors = [];
  const strategy = [];
  const ticket = [];

  for (let key in web3) {
    multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
    calls[key] = [];
    sponsors[key] = [];
    strategy[key] = [];
    ticket[key] = [];
  }

  for (let key in items) {
    const pool = items[key];

    // === Gate
    const gateContract = new web3[pool.network].eth.Contract(gateManagerAbi, pool.contractAddress);

    const gateCall = {
      id: pool.id,
      awardBalance: gateContract.methods.awardBalance(),
      totalValueLocked: gateContract.methods.TVL(),
    };

    if ('bonuses' in pool) {
      for (const bonus of pool.bonuses) {
        gateCall['rewardInfo_' + bonus.id] = gateContract.methods.rewardInfo(bonus.id);
      }
    }

    calls[pool.network].push(gateCall);

    // === Strategy
    const strategyContract = new web3[pool.network].eth.Contract(
      prizeStrategyAbi,
      pool.prizeStrategyAddress
    );
    strategy[pool.network].push({
      id: pool.id,
      expiresAt: strategyContract.methods.prizePeriodEndAt(),
      numberOfWinners: strategyContract.methods.numberOfWinners(),
    });

    // === Ticket
    const ticketContract = new web3[pool.network].eth.Contract(ecr20Abi, pool.rewardAddress);
    ticket[pool.network].push({
      id: pool.id,
      totalTickets: ticketContract.methods.totalSupply(),
    });

    // === Sponsor Tokens
    for (const sponsor of pool.sponsors) {
      const sponsorContract = new web3[pool.network].eth.Contract(ecr20Abi, sponsor.sponsorAddress);
      sponsors[pool.network].push({
        id: pool.id,
        sponsorToken: sponsor.sponsorToken,
        sponsorBalance: sponsorContract.methods.balanceOf(pool.prizePoolAddress),
      });
    }
  }

  const promises = [];
  for (const key in multicall) {
    promises.push(multicall[key].all([calls[key]]));
    promises.push(multicall[key].all([strategy[key]]));
    promises.push(multicall[key].all([sponsors[key]]));
    promises.push(multicall[key].all([ticket[key]]));
  }
  const results = await Promise.allSettled(promises);

  let response = [];
  results.forEach(result => {
    if (result.status !== 'fulfilled') {
      console.warn('getPoolsAll error', result.reason);
      // FIXME: queue chain retry?
      return;
    }
    response = [...response, ...result.value[0]];
  });

  let totalPrizesAvailable = new BigNumber(0);
  let totalTvl = new BigNumber(0);

  for (let i = 0; i < response.length; i++) {
    const item = response[i];
    const pool = pools[item.id];

    // === Gate
    if ('awardBalance' in item) {
      const awardPrice = pool.oracleId in prices ? prices[pool.oracleId] : 0;
      const awardBalance = new BigNumber(item.awardBalance)
        .times(new BigNumber(item.id === 'pots' ? 1 : 0.8))
        .dividedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals));
      const awardBalanceUsd = awardBalance.times(awardPrice);

      pool.awardBalance = awardBalance;
      pool.awardBalanceUsd = awardBalanceUsd;
      console.log(pool.id, item, pool.apyId, apy[pool.apyId]);
      pool.apy =
        !isEmpty(apy) && pool.apyId in apy
          ? new BigNumber(apy[pool.apyId].totalApy).times(100).div(2).toNumber()
          : 0;

      const totalValueLocked = new BigNumber(item.totalValueLocked);
      const totalTokenStaked = byDecimals(totalValueLocked, pool.tokenDecimals);
      pool.totalTokenStaked = totalTokenStaked;
      pool.totalStakedUsd = totalValueLocked
        .times(awardPrice)
        .dividedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals));
      pool.tvl = formatTvl(totalTokenStaked, awardPrice);

      if ('bonuses' in pool) {
        const bonuses = pool.bonuses.map(bonusConfig => {
          const rewardInfo = item['rewardInfo_' + bonusConfig.id];
          return calculateBoost(rewardInfo, pool, prices, bonusConfig);
        });

        const activeCompoundable =
          bonuses.find(bonus => bonus.compoundable && bonus.active) !== undefined;

        pool.bonusApy = bonuses.reduce((total, bonus) => total + bonus.apy, 0);

        if (activeCompoundable) {
          pool.bonusApr = bonuses.reduce((total, bonus) => total + bonus.apr, 0);
        }

        pool.bonuses = bonuses;
      }

      if (pool.status === 'active') {
        totalPrizesAvailable = totalPrizesAvailable.plus(awardBalanceUsd);
      }
    }

    // === Strategy
    if (!isEmpty(item.expiresAt)) {
      pool.expiresAt = item.expiresAt;
      pool.numberOfWinners = Number(item.numberOfWinners);
    }

    // === Ticket
    if (!isEmpty(item.totalTickets)) {
      pool.totalTickets = item.totalTickets;
    }

    // === Sponsor Tokens
    if (!isEmpty(item.sponsorBalance)) {
      const sponsor = pool.sponsors.find(s => s.sponsorToken === item.sponsorToken);

      if (sponsor) {
        const sponsorPrice =
          sponsor.sponsorOracleId in prices ? prices[sponsor.sponsorOracleId] : 0;
        const sponsorBalance = new BigNumber(item.sponsorBalance);
        const sponsorBalanceUsd = sponsorBalance.times(new BigNumber(sponsorPrice));
        const decimals = new BigNumber(10).exponentiatedBy(sponsor.sponsorTokenDecimals);
        sponsor.sponsorBalance = sponsorBalance.dividedBy(decimals);
        sponsor.sponsorBalanceUsd = sponsorBalanceUsd.dividedBy(decimals);
      }
    }
  }

  for (const pool of Object.values(items)) {
    pool.totalSponsorBalanceUsd = new BigNumber(0);
    pool.sponsors.forEach(sponsor => {
      pool.totalSponsorBalanceUsd = pool.totalSponsorBalanceUsd.plus(sponsor.sponsorBalanceUsd);
    });

    totalTvl = totalTvl.plus(pool.totalStakedUsd);
    if (pool.status === 'active') {
      totalPrizesAvailable = totalPrizesAvailable.plus(pool.totalSponsorBalanceUsd);
    }
  }

  dispatch({
    type: HOME_FETCH_POOLS_DONE,
    payload: {
      pools: pools,
      totalTvl: totalTvl.toNumber(),
      totalPrizesAvailable: totalPrizesAvailable,
      isPoolsLoading: false,
      lastUpdated: new Date().getTime(),
    },
  });

  return true;
};

function calculateBoost(rewardInfo, pool, prices, config) {
  const now = Date.now() / 1000;
  const periodFinish = new BigNumber(rewardInfo[2]);
  const alwaysActive = config.alwaysActive === true;
  const isActive = periodFinish > now || alwaysActive;
  const boostAddress = rewardInfo[0].toLowerCase();
  const boostData = tokensByNetworkAddress[pool.network][boostAddress];

  if (isActive) {
    const compoundable =
      pool.compoundApy === true && boostAddress === pool.tokenAddress.toLowerCase();
    const boostDecimals = new BigNumber(10).exponentiatedBy(boostData.decimals);
    const boostPrice = boostData.symbol in prices ? prices[boostData.symbol] : 0;
    const boostRate = new BigNumber(rewardInfo[3]);
    const boostYearly = boostRate.times(3600).times(24).times(365);
    const boostYearlyUsd = boostYearly.times(boostPrice).dividedBy(boostDecimals);
    const totalStakedUsd = pool.totalStakedUsd;
    const apr = boostYearlyUsd.dividedBy(totalStakedUsd).toNumber();

    return {
      ...config,
      ...boostData,
      apr: apr * 100,
      apy: (compoundable ? compound(apr) : apr) * 100,
      compoundable,
      active: isActive,
    };
  }

  return { ...config, ...boostData, apr: 0, apy: 0, compoundable: false, active: false };
}

const fetchPools = (item = false) => {
  return async (dispatch, getState) => {
    const state = getState();
    const pools = state.vaultReducer.pools;
    dispatch({ type: HOME_FETCH_POOLS_BEGIN });
    return await getPools(item ? [item] : pools, state, dispatch);
  };
};

const obj = {
  fetchPools,
};

export default obj;
