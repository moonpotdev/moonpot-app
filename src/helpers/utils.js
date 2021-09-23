import { config } from '../config/config';
import BigNumber from 'bignumber.js';

let trimReg = /(^\s*)|(\s*$)/g;

export function isEmpty(key) {
  if (key === undefined || key === '' || key === null) {
    return true;
  }
  if (typeof key === 'string') {
    key = key.replace(trimReg, '');
    return key === '' || key === null || key === 'null' || key === undefined || key === 'undefined';
  } else if (typeof key === 'undefined') {
    return true;
  } else if (typeof key == 'object') {
    for (let i in key) {
      return false;
    }
    return true;
  } else if (typeof key == 'boolean') {
    return false;
  }
}

export const getStablesForNetwork = () => {
  return config.stableCoins;
};

export const toBigNumber = maybeBigNumber => {
  return BigNumber.isBigNumber(maybeBigNumber) ? maybeBigNumber : new BigNumber(maybeBigNumber);
};

export const investmentOdds = (
  ticketTotalSupply,
  numberOfWinners,
  investedTickets = 0,
  newInvestmentTickets = 0
) => {
  const finalTotalSupply = toBigNumber(ticketTotalSupply).plus(newInvestmentTickets);
  const finalTicketsInvested = toBigNumber(investedTickets).plus(newInvestmentTickets);
  const one = toBigNumber(1);

  const oddsOfWinningOnce = finalTicketsInvested.dividedBy(finalTotalSupply);
  const oddsOfLosingOnce = one.minus(oddsOfWinningOnce);
  const oddsOfWinningAtLeastOnce = one.minus(oddsOfLosingOnce.exponentiatedBy(numberOfWinners));

  return one.dividedBy(oddsOfWinningAtLeastOnce).integerValue(BigNumber.ROUND_CEIL).toNumber();
};

export function compound(r, n = 365, t = 1, c = 1) {
  return (1 + (r * c) / n) ** (n * t) - 1;
}

export const styledBy = (property, mapping) => props => mapping[props[property]];

export function indexBy(arr, key, keyTransform = k => k) {
  return Object.fromEntries(arr.map(item => [keyTransform(item[key]), item]));
}

export function groupBy(arr, key, keyTransform = k => k) {
  const out = {};

  arr.forEach(item => {
    const groupKey = keyTransform(item[key]);
    if (groupKey in out) {
      out[groupKey].push(item);
    } else {
      out[groupKey] = [item];
    }
  });

  return out;
}

export function arrayUnique(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}

export function objectArrayFlatten(arr) {
  return arr.reduce((out, next) => ({ ...out, ...next }), {});
}

export const formatAddressShort = addr => {
  return addr.substr(0, 6) + '...' + addr.substr(addr.length - 4, 4);
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function variantClass(classes, prefix, variant, defaultClass = false) {
  const key = prefix + variant[0].toUpperCase() + variant.substr(1);
  return key in classes ? classes[key] : defaultClass;
}

export const calculateTokenProjectedPrize = ({ pot }) => {
  const APY = BigNumber(pot.apy); //INPUT APY
  const convertedAPY = BigNumber.sum(APY.multipliedBy(0.01), 1); //Convert APY to decimal and add 1
  var dailyRate = Math.pow(convertedAPY.toFixed(20), 1 / 365) - 1; //Calculate daily APR

  const secondsToDraw = new BigNumber(pot.secondsToDraw); //INPUT seconds till draw
  const daysToDraw = secondsToDraw.dividedBy(86400).toFixed(20); //Convert seconds to days till draw

  const TVL = BigNumber(pot.totalTokenStaked); //INPUT current locked value
  const futureValue = TVL.toFixed(20) * (Math.pow(1 + dailyRate, daysToDraw) - 1) * 0.4; //Calculate value to be added

  const currentAwardBalance = pot.awardBalance; //INPUT current prize balance
  const projectedPrizeTotal = BigNumber.sum(currentAwardBalance, futureValue);

  //console.log(pot);
  //console.log(futureValue);
  //console.log(projectedPrizeTotal.toFixed(2));

  return projectedPrizeTotal;
};

export const calculateUSDProjectedPrize = ({ pot }) => {
  const APY = BigNumber(pot.apy); //INPUT APY
  const convertedAPY = BigNumber.sum(APY.multipliedBy(0.01), 1); //Convert APY to decimal and add 1
  var dailyRate = Math.pow(convertedAPY.toFixed(20), 1 / 365) - 1; //Calculate daily APR

  const secondsToDraw = new BigNumber(pot.secondsToDraw); //INPUT seconds till draw
  const daysToDraw = secondsToDraw.dividedBy(86400).toFixed(20); //Convert seconds to days till draw

  const TVL = BigNumber(pot.totalStakedUsd); //INPUT current locked value
  const futureValue = TVL.toFixed(20) * (Math.pow(1 + dailyRate, daysToDraw) - 1) * 0.4; //Calculate value to be added

  const currentAwardBalance = pot.awardBalanceUsd; //INPUT current prize balance
  const projectedPrizeTotal = BigNumber.sum(currentAwardBalance, futureValue);

  console.log(pot);
  console.log(futureValue);
  console.log(projectedPrizeTotal.toFixed(2));

  return projectedPrizeTotal;
};
