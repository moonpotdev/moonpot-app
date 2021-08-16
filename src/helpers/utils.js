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

export const investmentOdds = (currentTvl, investment, winners) => {
  const oddsOfWinningOnce = investment.dividedBy(currentTvl.plus(investment));
  const oddsOfLosingOnce = BigNumber(1).minus(oddsOfWinningOnce);
  const oddsOfWinningAtLeastOnce = BigNumber(1).minus(oddsOfLosingOnce.exponentiatedBy(winners));
  return Math.ceil(1 / Number(oddsOfWinningAtLeastOnce));
};

export function compound(r, n = 365, t = 1, c = 1) {
  return (1 + (r * c) / n) ** (n * t) - 1;
}
