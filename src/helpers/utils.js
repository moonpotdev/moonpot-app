import BigNumber from 'bignumber.js';
import { networkById } from '../config/networks';
import { hexToNumber, isHexStrict } from 'web3-utils';

let trimReg = /(^\s*)|(\s*$)/g;

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

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

export function indexBy(arr, key, keyTransform = null) {
  if (keyTransform) {
    return Object.fromEntries(arr.map(item => [keyTransform(item[key]), item]));
  }

  return Object.fromEntries(arr.map(item => [item[key], item]));
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

export function getFairplayFeePercent(secondsRemaining, days = 10, fee = 0.05) {
  if (secondsRemaining) {
    const max = 3600 * 24 * days;
    return (secondsRemaining * fee) / max;
  }

  return 0;
}

export function getApiCacheBuster() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.getTime();
}

export function listJoin(list, emptyValue = '', sep = ', ', final = ' & ') {
  if (list && list.length > 0) {
    return list.length > 1 ? list.slice(0, -1).join(sep) + final + list[list.length - 1] : list[0];
  }

  return emptyValue;
}

export function getNetworkExplorerUrl(networkKey, path = '/') {
  return networkById[networkKey].explorerUrl + path;
}

export function maybeHexToNumber(input) {
  if (typeof input === 'number') {
    return input;
  }

  if (typeof input === 'string') {
    return isHexStrict(input) ? hexToNumber(input) : Number(input);
  }

  throw new Error(`${typeof input} "${input}" is not valid hex or number.`);
}

/**
 * @param {BigNumber[]} numbers
 * @returns {BigNumber}
 */
export function medianOf(numbers) {
  const sortedNumbers = numbers.slice().sort((a, b) => a.comparedTo(b));
  const i = Math.floor((sortedNumbers.length - 1) / 2);
  return sortedNumbers[i];
}
