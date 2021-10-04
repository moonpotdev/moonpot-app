import { HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE } from '../constants';
import BigNumber from 'bignumber.js';
import { MultiCall } from 'eth-multicall';
import { config } from '../../../config/config';
import { compound, isEmpty } from '../../../helpers/utils';
import { byDecimals, formatTvl } from '../../../helpers/format';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';

const gateManagerAbi = require('../../../config/abi/gatemanager.json');
const ecr20Abi = require('../../../config/abi/erc20.json');
const prizeStrategyAbi = require('../../../config/abi/prizestrategy.json');
const prizePoolAbi = require('../../../config/abi/prizepool.json');

function timeLastDrawBefore(nextDraw, durationDays, beforeWhen) {
  const duration = durationDays * 24 * 60 * 60;

  while (nextDraw < beforeWhen) {
    if (nextDraw + duration < beforeWhen) {
      nextDraw += duration;
    } else {
      break;
    }
  }

  return nextDraw;
}

function calculateZiggyPrediction(ziggy, others, prices) {
  const nowSeconds = Date.now() / 1000;
  const drawCutoff = 5 * 60; // 5 minutes - bot should automate it

  // Can't predict awardBalance as it's just fees
  ziggy.projectedAwardBalance = ziggy.awardBalance;
  ziggy.projectedAwardBalanceUsd = ziggy.awardBalanceUsd;

  // Only if not currently being drawn
  if (ziggy.expiresAt > nowSeconds) {
    const ziggyDrawCutoff = ziggy.expiresAt - drawCutoff;
    let extraSponsorBalanceUsd = new BigNumber(0);
    const projectedSponsors = ziggy.sponsors.map(s => ({
      ...s,
      sponsorBalance: new BigNumber(s.sponsorBalance),
      sponsorBalanceUsd: new BigNumber(s.sponsorBalanceUsd),
    }));

    for (const pot of others) {
      // If pot contributes to Ziggy's prize and will be drawn at least once before ziggy
      if (pot.interestBreakdown && pot.interestBreakdown.ziggyPrize) {
        if (pot.expiresAt < ziggyDrawCutoff) {
          // prize=3, interest=50 ==> multiplier=0.06
          const afterFeesMultiplier =
            (pot.interestBreakdown.ziggyPrize || 0) / (100 - (pot.interestBreakdown.interest || 0));
          // Calculate time of last draw of this pot, before ziggy's draw cutoff, allowing for multiple draws
          const lastDrawBeforeZiggy = timeLastDrawBefore(
            pot.expiresAt,
            pot.duration,
            ziggyDrawCutoff
          );
          // Calculate interest up until draw
          const potAward = calculateProjectedPotAward(
            pot,
            lastDrawBeforeZiggy,
            afterFeesMultiplier
          );

          // Which token we are adding to sponsors
          let sponsorToken = tokensByNetworkAddress[pot.network][pot.tokenAddress.toLowerCase()];

          // We are converting from the prize token to another before adding ziggy's prize?
          if (pot.ziggyPrizeToken) {
            const token = tokensByNetworkSymbol[pot.network][pot.ziggyPrizeToken];
            if (token) {
              // Convert from this token to that token
              const tokenPrice = prices[token.oracleId] || 0;
              potAward.tokens = tokenPrice ? potAward.usd.dividedBy(tokenPrice) : new BigNumber(0);
              // Now awarding in this token
              sponsorToken = token;
            }
          }

          // Build prizes array
          let prizes = [{ token: sponsorToken, award: potAward }];

          // Are we awarding an LP?
          if (sponsorToken.type === 'lp') {
            const usdShare = potAward.usd.dividedBy(sponsorToken.lp.length);

            prizes = sponsorToken.lp.map(symbol => {
              const partToken = tokensByNetworkSymbol[pot.network][symbol];
              const partTokenPrice = prices[partToken.oracleId] || 0;

              return {
                token: partToken,
                award: {
                  usd: usdShare,
                  tokens: partTokenPrice ? usdShare.dividedBy(partTokenPrice) : new BigNumber(0),
                },
              };
            });
          }

          // Add each prize to sponsors array
          for (const prize of prizes) {
            // Sponsor
            const existingSponsor = projectedSponsors.find(
              sponsor => sponsor.sponsorAddress === prize.token.address
            );
            if (existingSponsor) {
              existingSponsor.sponsorBalance = existingSponsor.sponsorBalance.plus(
                prize.award.tokens
              );
              existingSponsor.sponsorBalanceUsd = existingSponsor.sponsorBalanceUsd.plus(
                prize.award.usd
              );
            } else {
              projectedSponsors.push({
                sponsorToken: prize.token.symbol,
                sponsorOracleId: prize.token.oracleId,
                sponsorAddress: prize.token.address,
                sponsorTokenDecimals: prize.token.decimals,
                sponsorBalance: prize.award.tokens,
                sponsorBalanceUsd: prize.award.usd,
              });
            }
          }

          // Add up the extra sponsor usd totals
          extraSponsorBalanceUsd = extraSponsorBalanceUsd.plus(potAward.usd);
        }
      }
    }

    // Add projected sponsors to ziggy
    ziggy.projectedSponsors = projectedSponsors;

    // Sum total of all sponsors USD
    ziggy.projectedTotalSponsorBalanceUsd =
      ziggy.totalSponsorBalanceUsd.plus(extraSponsorBalanceUsd);
  } else {
    ziggy.projectedTotalSponsorBalanceUsd = ziggy.totalSponsorBalanceUsd;
    ziggy.projectedSponsors = ziggy.sponsors;
  }

  return ziggy;
}

function calculateProjectedPotAward(pot, untilWhen, afterFeesMultiplier) {
  // Now in seconds
  const nowSeconds = Date.now() / 1000;
  // Only the balance in prize pool earns interest for prize
  const amountEarning = byDecimals(pot.prizePoolBalance, pot.tokenDecimals);
  // Days until draw (floating point)
  const daysUntilDraw = (untilWhen - nowSeconds) / 86400;
  // Underlying yield source interest % (350% -> 3.5)
  const apy = pot.underlyingApy / 100;
  // "Uncompound" APY to get daily
  const dpy = Math.pow(apy + 1, 1 / 365) - 1;
  // Recompound to get interest until draw
  const interestUntilDraw = Math.pow(1 + dpy, daysUntilDraw) - 1;
  // Interest earned in tokens, after fees
  const tokenInterest = amountEarning.multipliedBy(interestUntilDraw);
  // New award balance after fees
  const projectedTokenAwardBalance = pot.fullAwardBalance
    .plus(tokenInterest)
    .multipliedBy(afterFeesMultiplier);

  return {
    tokens: projectedTokenAwardBalance,
    usd: projectedTokenAwardBalance.multipliedBy(pot.tokenPrice),
  };
}

function calculateProjections(pots, prices) {
  const activePots = Object.values(pots).filter(
    pot => pot.id !== 'pots' && pot.status === 'active'
  );
  const nowSeconds = Date.now() / 1000;

  // All active pots but ziggy
  for (const pot of activePots) {
    // Only make projections for pots drawing in the future/that have a prize component
    if (pot.interestBreakdown && pot.interestBreakdown.prize && pot.expiresAt > nowSeconds) {
      // prize=40, interest=50 ==> multiplier=0.8
      const afterFeesMultiplier =
        (pot.interestBreakdown.prize || 0) / (100 - (pot.interestBreakdown.interest || 0));

      // Calculate interest up until draw
      const projectedAward = calculateProjectedPotAward(pot, pot.expiresAt, afterFeesMultiplier);

      // Projections...
      pot.projectedAwardBalance = projectedAward.tokens;
      pot.projectedAwardBalanceUsd = projectedAward.usd;
    } else {
      console.warn(`Missing interestBreakdown.prize for ${pot.id}`);
      pot.projectedAwardBalance = pot.awardBalance;
      pot.projectedAwardBalanceUsd = pot.awardBalanceUsd;
    }

    // Sponsors don't get projected
    pot.projectedTotalSponsorBalanceUsd = pot.totalSponsorBalanceUsd;
    pot.projectedSponsors = pot.sponsors;
  }

  // Ziggy's Pot
  pots['pots'] = calculateZiggyPrediction(pots['pots'], activePots, prices);

  return pots;
}

function calculateProjectedTotalPrizesAvailable(pots) {
  let total = new BigNumber(0);
  for (const pot of Object.values(pots)) {
    if (pot.status === 'active') {
      total = total
        .plus(pot.projectedAwardBalanceUsd || pot.awardBalanceUsd)
        .plus(pot.projectedTotalSponsorBalanceUsd || pot.totalSponsorBalanceUsd);
    }
  }

  return total;
}

const getPools = async (items, state, dispatch) => {
  console.log('redux getPools processing...');
  const web3 = state.walletReducer.rpc;
  const pools = { ...state.vaultReducer.pools }; // need new object ref so filters can re-run when any pool changes
  const prices = state.pricesReducer.prices;
  const apy = state.pricesReducer.apy;

  const multicall = [];
  const calls = [];
  const sponsors = [];
  const prizePool = [];
  const strategy = [];
  const ticket = [];

  for (let key in web3) {
    multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
    calls[key] = [];
    sponsors[key] = [];
    strategy[key] = [];
    prizePool[key] = [];
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

    // === PrizePool
    const prizePoolContract = new web3[pool.network].eth.Contract(
      prizePoolAbi,
      pool.prizePoolAddress
    );

    prizePool[pool.network].push({
      id: pool.id,
      prizePoolBalance: prizePoolContract.methods.balance(),
    });
  }

  const promises = [];
  for (const key in multicall) {
    promises.push(multicall[key].all([calls[key]]));
    promises.push(multicall[key].all([strategy[key]]));
    promises.push(multicall[key].all([sponsors[key]]));
    promises.push(multicall[key].all([ticket[key]]));
    promises.push(multicall[key].all([prizePool[key]]));
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
      const awardMultiplier = pool.interestBreakdown
        ? (pool.interestBreakdown.prize || 0) / (100 - (pool.interestBreakdown.interest || 0))
        : 1;

      const tokenDecimals = new BigNumber(10).exponentiatedBy(pool.tokenDecimals);
      const awardPrice = pool.oracleId in prices ? prices[pool.oracleId] : 0;
      const awardBalance = new BigNumber(item.awardBalance || '0')
        .times(awardMultiplier)
        .dividedBy(tokenDecimals);
      const awardBalanceUsd = awardBalance.times(awardPrice);

      pool.tokenPrice = awardPrice;
      pool.awardBalance = awardBalance;
      pool.awardBalanceUsd = awardBalanceUsd;
      pool.fullAwardBalance = new BigNumber(item.awardBalance || '0').dividedBy(tokenDecimals);

      if (
        pool.apyId &&
        pool.interestBreakdown &&
        pool.interestBreakdown.interest &&
        !isEmpty(apy) &&
        pool.apyId in apy
      ) {
        pool.apy = new BigNumber(apy[pool.apyId].totalApy)
          .times(pool.interestBreakdown.interest)
          .toNumber();
        pool.underlyingApy = new BigNumber(apy[pool.apyId].totalApy).times(100).toNumber();
      } else {
        pool.apy = 0;
        pool.underlyingApy = 0;
      }

      const totalValueLocked = new BigNumber(item.totalValueLocked);
      const totalTokenStaked = byDecimals(totalValueLocked, pool.tokenDecimals);
      pool.totalTokenStaked = totalTokenStaked;
      pool.totalStakedUsd = totalValueLocked
        .times(awardPrice)
        .dividedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals));
      pool.tvl = formatTvl(totalTokenStaked, awardPrice);

      if ('bonuses' in pool) {
        const bonuses = pool.bonuses
          .map(bonusConfig => {
            const rewardInfo = item['rewardInfo_' + bonusConfig.id];
            if (rewardInfo) {
              return calculateBoost(rewardInfo, pool, prices, bonusConfig);
            }

            return null;
          })
          .filter(bonus => !!bonus);

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
      pool.expiresAt = Number(item.expiresAt);
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

    // === PrizePool
    if (!isEmpty(item.prizePoolBalance)) {
      pool.prizePoolBalance = item.prizePoolBalance;
    }

    // New ref for sponsors for state update
    pool.sponsors = [...pool.sponsors];
  }

  // == Sums per pool
  for (const pool of Object.values(items)) {
    // === Total USD of prize sponsors
    pool.totalSponsorBalanceUsd = new BigNumber(0);
    pool.sponsors.forEach(sponsor => {
      pool.totalSponsorBalanceUsd = pool.totalSponsorBalanceUsd.plus(sponsor.sponsorBalanceUsd);
    });

    // === Sum total USD prizes available across all pools
    if (pool.status === 'active') {
      totalPrizesAvailable = totalPrizesAvailable.plus(pool.totalSponsorBalanceUsd);
    }

    // === Sum total USD TVL across all pools
    totalTvl = totalTvl.plus(pool.totalStakedUsd);
  }

  const poolsWithProjections = calculateProjections(pools, prices);
  const projectedTotalPrizesAvailable =
    calculateProjectedTotalPrizesAvailable(poolsWithProjections);

  dispatch({
    type: HOME_FETCH_POOLS_DONE,
    payload: {
      pools: poolsWithProjections,
      totalTvl: totalTvl.toNumber(),
      totalPrizesAvailable: totalPrizesAvailable,
      projectedTotalPrizesAvailable: projectedTotalPrizesAvailable,
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
  if (item) {
    console.warn('[DEPRECATED] Must update all pools at once for projected prize calculations');
  }

  return async (dispatch, getState) => {
    const state = getState();
    const pools = state.vaultReducer.pools;
    dispatch({ type: HOME_FETCH_POOLS_BEGIN });
    return await getPools(pools, state, dispatch);
  };
};

const obj = {
  fetchPools,
};

export default obj;
