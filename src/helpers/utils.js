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

export function sortObjectsAsc(objectsArray, key) {
  return objectsArray.sort((a, b) => (a[key] > b[key]) - (a[key] < b[key]));
}

export function sortObjectsDesc(objectsArray, key) {
  return objectsArray.sort((a, b) => (a[key] < b[key]) - (a[key] > b[key]));
}
