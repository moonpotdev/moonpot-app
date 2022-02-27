import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectFilterConfig } from './select';
import { FILTER_NAMED_SORTS } from './constants';

const SORT_COMPARE_FUNCTIONS = {
  defaultOrder: compareNumber,
  totalStakedUsd: compareBigNumber,
  name: compareStringCaseInsensitive,
  expiresAt: compareNumber,
  projectedTotalPrizeUsd: compareBigNumber,
  totalApy: compareNumber,
};

function filterIncludePot(pot, deposited, config) {
  if (pot.status !== config.status) {
    return false;
  }

  if (config.network !== 'all' && pot.network !== config.network) {
    return false;
  }

  if (config.deposited === true && deposited === false) {
    return false;
  }

  if (
    config.category !== 'all' &&
    config.category !== 'featured' &&
    !pot.categories.includes(config.category)
  ) {
    return false;
  }

  if (config.category === 'featured' && pot.featured !== true) {
    return false;
  }

  return true;
}

function compareNumber(a, b) {
  return (a > b) - (a < b);
}

function compareStringCaseInsensitive(a, b) {
  const lowercaseA = a.toLowerCase();
  const lowercaseB = b.toLowerCase();
  return (lowercaseA > lowercaseB) - (lowercaseA < lowercaseB);
}

function compareBigNumber(a, b) {
  if (a.lt(b)) return -1;
  if (a.gt(b)) return 1;
  return 0;
}

function sortPots(pots, key, dir) {
  if (key in SORT_COMPARE_FUNCTIONS) {
    return pots.sort((a, b) => {
      const valueA = dir === 'asc' ? a[key] : b[key];
      const valueB = dir === 'asc' ? b[key] : a[key];

      return SORT_COMPARE_FUNCTIONS[key](valueA, valueB);
    });
  }

  return pots;
}

function getDeposited(pots, balances) {
  return Object.fromEntries(
    pots.map(pot => [pot.id, (balances[pot.contractAddress + ':total']?.balance ?? '0') !== '0'])
  );
}

export const filterApply = createAsyncThunk('filter/apply', async (_, { getState }) => {
  const state = getState();
  const config = selectFilterConfig(state);
  console.log('Applying filter...', config);
  const pots = Object.values(state.vault.pools);
  const deposited = getDeposited(pots, state.balance.tokens);

  const filtered = pots.filter(pot => filterIncludePot(pot, deposited[pot.id], config));
  const sorted = sortPots(
    filtered,
    FILTER_NAMED_SORTS[config.sort][0],
    FILTER_NAMED_SORTS[config.sort][1]
  );

  return sorted.map(pot => pot.id);
});
