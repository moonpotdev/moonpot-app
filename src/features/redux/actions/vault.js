import { HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE } from '../constants';
import BigNumber from 'bignumber.js';
import { MultiCall } from 'eth-multicall';
import { config } from '../../../config/config';
import { compound, isEmpty, ZERO } from '../../../helpers/utils';
import { byDecimals, formatTvl } from '../../../helpers/format';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';
import beefyVaultAbi from '../../../config/abi/beefyvault.json';

const gateManagerAbi = require('../../../config/abi/gatemanager.json');
const ecr20Abi = require('../../../config/abi/erc20.json');
const prizeStrategyAbi = require('../../../config/abi/prizestrategy.json');
const prizePoolAbi = require('../../../config/abi/prizepool.json');
const rewardPoolAbi = require('../../../config/abi/rewardPool.json');

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
    let extraSponsorBalanceUsd = ZERO;
    const projectedSponsors = ziggy.sponsors.map(s => ({
      ...s,
      sponsorBalance: new BigNumber(s.sponsorBalance),
      sponsorBalanceUsd: new BigNumber(s.sponsorBalanceUsd),
    }));

    for (const pot of others) {
      // If pot contributes to Ziggy's prize and will be drawn at least once before ziggy
      if (pot.interestBreakdown && pot.interestBreakdown.ziggyPrize) {
        if (pot.expiresAt < ziggyDrawCutoff) {
          // How much of prize pool interest goes to ziggy as prize
          const prizePoolInterestMultiplier = calculatePrizePoolInterestMultiplier(
            pot,
            'ziggyPrize'
          );
          // How much of the award balance goes to ziggy as prize
          const awardBalancePrizeMultiplier = calculateAwardBalancePrizeMultiplier(
            pot,
            'ziggyPrize'
          );

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
            awardBalancePrizeMultiplier,
            prizePoolInterestMultiplier
          );

          // Which token we are adding to sponsors
          let sponsorToken = tokensByNetworkAddress[pot.network][pot.tokenAddress.toLowerCase()];

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
                  tokens: partTokenPrice ? usdShare.dividedBy(partTokenPrice) : ZERO,
                },
              };
            });
          }

          // Convert everything that isn't BUSD or POTS to BUSD
          const BUSD = tokensByNetworkSymbol[pot.network]['BUSD'];
          const BUSDPrice = prices[BUSD.oracleId] || 1;
          const convertedPrizes = prizes.map(prize => {
            if (prize.token.symbol !== 'POTS' && prize.token.symbol !== 'BUSD') {
              prize.token = BUSD;
              prize.award.tokens = prize.award.usd.dividedBy(BUSDPrice);
            }

            return prize;
          });

          // Add each prize to sponsors array
          for (const prize of convertedPrizes) {
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

function getTokenInterestUntil(pot, untilWhen, prizePoolInterestMultiplier) {
  // Now in seconds
  const nowSeconds = Date.now() / 1000;
  // Only the balance in prize pool earns interest for prize
  const amountEarning = byDecimals(pot.prizePoolBalance, pot.tokenDecimals);
  // Days until draw (floating point)
  const secondsUntilDraw = untilWhen - nowSeconds;

  // Special reward pool handling
  if (pot.rewardPool) {
    // Avoid divided by zero
    if (pot.rewardPoolRate.isZero() || pot.rewardPoolTotalSupply.isZero()) {
      return ZERO;
    }

    // How much will be rewarded between now and draw
    // Note: assumes reward pool won't finish before draw date
    const rewardsLeft = pot.rewardPoolRate.multipliedBy(secondsUntilDraw);
    // How much of that prize pool will get
    const earnedUntilDraw = rewardsLeft
      .multipliedBy(amountEarning)
      .dividedBy(pot.rewardPoolTotalSupply);

    // After fees
    return earnedUntilDraw.multipliedBy(prizePoolInterestMultiplier);
  }

  // Days until draw (floating point)
  const daysUntilDraw = (untilWhen - nowSeconds) / 86400;
  // Daily interest from vault (not trading)
  const dpy = pot.apyBreakdown.vaultApr / 365;
  // Recompound to get interest until draw
  const interestUntilDraw = Math.pow(1 + dpy, daysUntilDraw) - 1;
  // Interest earned in tokens
  const earnedUntilDraw = amountEarning.multipliedBy(interestUntilDraw);
  // After fees
  return earnedUntilDraw.multipliedBy(prizePoolInterestMultiplier);
}

function calculateProjectedPotAward(
  pot,
  untilWhen,
  awardBalancePrizeMultiplier,
  prizePoolInterestMultiplier
) {
  const tokenInterest = getTokenInterestUntil(pot, untilWhen, prizePoolInterestMultiplier);
  // Current awardBalance that goes to prize
  const currentAwardBalance = pot.fullAwardBalance.multipliedBy(awardBalancePrizeMultiplier);
  // New award balance
  const projectedTokenAwardBalance = currentAwardBalance.plus(tokenInterest);

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
      // How much of prize pool interest goes to prize
      const prizePoolInterestMultiplier = calculatePrizePoolInterestMultiplier(pot);
      // How much of the award balance goes to prize
      const awardBalancePrizeMultiplier = calculateAwardBalancePrizeMultiplier(pot);

      // Calculate interest up until draw
      const projectedAward = calculateProjectedPotAward(
        pot,
        pot.expiresAt,
        awardBalancePrizeMultiplier,
        prizePoolInterestMultiplier
      );

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
  let total = ZERO;
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
  const mooToken = [];
  const rewardPool = [];

  for (let key in web3) {
    multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
    calls[key] = [];
    sponsors[key] = [];
    strategy[key] = [];
    prizePool[key] = [];
    ticket[key] = [];
    mooToken[key] = [];
    rewardPool[key] = [];
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

    // === PPFS TODO: use ppfs from prices instead
    if ('mooTokenAddress' in pool && pool.mooTokenAddress) {
      const mooTokenContract = new web3[pool.network].eth.Contract(
        beefyVaultAbi,
        pool.mooTokenAddress
      );
      mooToken[pool.network].push({
        id: pool.id,
        ppfs: mooTokenContract.methods.getPricePerFullShare(),
      });
    }

    // Rewardpool
    if ('rewardPool' in pool && pool.rewardPool) {
      const rewardPoolContract = new web3[pool.network].eth.Contract(
        rewardPoolAbi,
        pool.rewardPool
      );
      rewardPool[pool.network].push({
        id: pool.id,
        rewardPoolRate: rewardPoolContract.methods.rewardRate(),
        rewardPoolPeriodFinish: rewardPoolContract.methods.periodFinish(),
        rewardPoolTotalSupply: rewardPoolContract.methods.totalSupply(),
      });
    }
  }

  const promises = [];
  const groups = [calls, strategy, sponsors, ticket, prizePool, mooToken, rewardPool];
  for (const network in multicall) {
    for (const group of groups) {
      if (group[network] && group[network].length) {
        promises.push(multicall[network].all([group[network]]));
      }
    }
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

  let totalPrizesAvailable = ZERO;
  let totalTvl = ZERO;

  for (let i = 0; i < response.length; i++) {
    const item = response[i];
    const pool = pools[item.id];

    // === Gate
    if ('awardBalance' in item) {
      const awardMultiplier = calculateAwardBalancePrizeMultiplier(pool);

      const tokenDecimals = new BigNumber(10).exponentiatedBy(pool.tokenDecimals);
      const fullAwardBalance = new BigNumber(item.awardBalance || '0').dividedBy(tokenDecimals);
      const awardPrice = pool.oracleId in prices ? prices[pool.oracleId] : 0;
      const awardBalance = fullAwardBalance.times(awardMultiplier);
      const awardBalanceUsd = awardBalance.times(awardPrice);

      pool.tokenPrice = awardPrice;
      pool.awardBalance = awardBalance;
      pool.awardBalanceUsd = awardBalanceUsd;
      pool.fullAwardBalance = fullAwardBalance;
      pool.apyBreakdown = getApyBreakdown(pool.apyId, apy);

      if (pool.apyBreakdown.totalApy && pool.interestBreakdown && pool.interestBreakdown.interest) {
        pool.apy =
          calculatePlayerApy(pool.apyBreakdown, pool.interestBreakdown.interest / 100) * 100;
      } else {
        pool.apy = 0;
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

    // === mooToken
    if (!isEmpty(item.ppfs)) {
      const ppfs = new BigNumber(item.ppfs || 1).dividedBy(new BigNumber(10).exponentiatedBy(18));
      pool.ppfs = ppfs.toNumber();
    }

    // == rewardPool
    if (!isEmpty(item.rewardPoolRate)) {
      const nowSeconds = Date.now() / 1000;
      if (
        isEmpty(item.rewardPoolPeriodFinish) ||
        item.rewardPoolPeriodFinish === '0' ||
        item.rewardPoolPeriodFinish < nowSeconds
      ) {
        pool.rewardPoolRate = ZERO;
        pool.rewardPoolTotalSupply = ZERO;
      } else {
        pool.rewardPoolRate = byDecimals(item.rewardPoolRate, pool.tokenDecimals);
        pool.rewardPoolTotalSupply = byDecimals(item.rewardPoolTotalSupply, pool.tokenDecimals);
      }
    }

    // New ref for sponsors for state update
    pool.sponsors = [...pool.sponsors];
  }

  // == Sums per pool
  for (const pool of Object.values(items)) {
    // === Total USD of prize sponsors
    pool.totalSponsorBalanceUsd = ZERO;
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

/**
 * Computes missing values in breakdown, assuming all apy is farm apy if not present
 * @param {string} id
 * @param {object} apys
 * @returns {{totalApy: number, vaultApr: number, tradingApr: number}}
 */
function getApyBreakdown(id, apys) {
  const out = {
    totalApy: 0,
    vaultApr: 0,
    tradingApr: 0,
  };

  if (id in apys && 'totalApy' in apys[id]) {
    const apy = apys[id];

    out.totalApy = apy.totalApy;

    if ('tradingApr' in apy) {
      out.tradingApr = apy.tradingApr;
    }

    if ('vaultApr' in apy) {
      out.vaultApr = apy.vaultApr;
    } else {
      // assume all apy is from vault, compounded once per day
      out.vaultApr = (Math.pow(apy.totalApy + 1, 1 / 365) - 1) * 365;
    }
  }

  return out;
}

/**
 * Calculate the players APY: share of vault + 100% of trading
 *
 * @param {{totalApy: number, vaultApr: number, tradingApr: number}} apy Object from getApyBreakdown
 * @param {number} ratio Player interest ratio 0-1
 * @param {int} [compounds] Number of compounds per year
 * @returns {number} 0 - 1
 */
function calculatePlayerApy(apy, ratio, compounds = 365) {
  const dailyVaultPr = apy.vaultApr / compounds;
  const vaultApy = (Math.pow(1 + dailyVaultPr, compounds) - 1) * ratio;

  return (1 + vaultApy) * (1 + apy.tradingApr) - 1;
}

/**
 * Calculate how much of awardBalance is for the prize
 *
 * @param {object} pot Pot from config
 * @param {string} [prizeKey]
 * @returns {number} 0 - 1; how much of awardBalance is for the prize
 */
function calculateAwardBalancePrizeMultiplier(pot, prizeKey = 'prize') {
  if ('interestBreakdown' in pot) {
    const breakdown = pot.interestBreakdown;
    const awardBalancePercent = getPercentToAwardBalance(breakdown);
    const prizePercent = prizeKey in breakdown ? breakdown[prizeKey] : 0;

    // Nothing is going to award balance
    if (awardBalancePercent === 0) {
      // Everything in awardBalance must be fairness fees
      return 1;
    }

    // Prize balance is % going to prize / % going to awardBalance
    return prizePercent / awardBalancePercent;
  }

  // No interest; everything in awardBalance must be fairness fees
  return 1;
}

/**
 * What % of total interest generated goes to awardBalance
 *
 * @param {{prize: number, interest: number, ziggyInterest: number, ziggyPrize: number, buyback: number}} breakdown
 * @returns {number}
 */
function getPercentToAwardBalance(breakdown) {
  const nonAwardBalance = ['interest'];
  let percentToAwardBalance = 100;

  for (const [key, percent] of Object.entries(breakdown)) {
    if (nonAwardBalance.includes(key)) {
      percentToAwardBalance -= percent;
    }
  }

  return percentToAwardBalance;
}

/**
 * Calculates how much of interest generated by prize pool goes to the prize
 * @param {object} pot
 * @param {string} [prizeKey]
 */
function calculatePrizePoolInterestMultiplier(pot, prizeKey = 'prize') {
  if ('interestBreakdown' in pot) {
    const breakdown = pot.interestBreakdown;
    const awardBalancePercent = getPercentToAwardBalance(breakdown);
    const prizePercent = prizeKey in breakdown ? breakdown[prizeKey] : 0;

    // Nothing is going to award balance
    if (awardBalancePercent === 0) {
      // No interest
      return 0;
    }

    // Prize interest is % going to prize / % going to awardBalance
    return prizePercent / awardBalancePercent;
  }

  // No interest
  return 0;
}

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
    const boostPrice = boostData.oracleId in prices ? prices[boostData.oracleId] : 0;
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
