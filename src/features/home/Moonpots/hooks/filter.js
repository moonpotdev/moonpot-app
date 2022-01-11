import { useEffect, useMemo } from 'react';
import { useLocalStorage } from '../../../../helpers/hooks';

const FILTER_DEFAULT = {
  version: 2, // Bump+1 if changes are made to force reset on end user
  sortKey: 'defaultOrder', // Must have matching entry in SORT_COMPARE_FUNCTIONS
  sortDir: 'asc',
  deposited: false,
  retired: false,
};

const FILTER_STORAGE_KEY = 'moonHomeSortConfig';

const SORT_COMPARE_FUNCTIONS = {
  defaultOrder: compareNumber,
  totalStakedUsd: compareBigNumber,
  name: compareStringCaseInsensitive,
  expiresAt: compareNumber,
  projectedTotalPrizeUsd: compareBigNumber,
  totalApy: compareNumber,
};

function filterIncludePot(pot, vaultType, config) {
  if (pot.status !== (config.retired ? 'eol' : 'active')) {
    return false;
  }

  if (config.deposited && pot.deposited === 0) {
    return false;
  }

  if (vaultType !== 'all' && vaultType !== pot.vaultType && vaultType !== 'featured') {
    return false;
  }

  if (vaultType === 'featured' && pot.featured !== true) {
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

export function sortPots(pots, key, dir) {
  if (key in SORT_COMPARE_FUNCTIONS) {
    return pots.sort((a, b) => {
      const valueA = dir === 'asc' ? a[key] : b[key];
      const valueB = dir === 'asc' ? b[key] : a[key];

      return SORT_COMPARE_FUNCTIONS[key](valueA, valueB);
    });
  }

  return pots;
}

export function useSortKey(sort) {
  if (sort === 'next-draw') {
    return ['expiresAt', 'asc'];
  } else if (sort === 'prize') {
    return ['projectedTotalPrizeUsd', 'desc'];
  } else if (sort === 'apy') {
    return ['totalApy', 'desc'];
  } else {
    return ['defaultOrder', 'asc'];
  }
}

export function useFilteredPots(pots, vaultType, config) {
  return useMemo(() => {
    const filtered = Object.values(pots).filter(pot => filterIncludePot(pot, vaultType, config));

    return sortPots(filtered, config.sortKey, config.sortDir);
  }, [pots, vaultType, config]);
}

function configNeedsReset(config) {
  return !config || !('version' in config) || config.version < FILTER_DEFAULT.version;
}

export function useFilterConfig() {
  const [filterConfig, setFilterConfig] = useLocalStorage(FILTER_STORAGE_KEY, FILTER_DEFAULT);
  const needsReset = configNeedsReset(filterConfig);

  useEffect(() => {
    if (needsReset) {
      setFilterConfig({ ...FILTER_DEFAULT });
    }
  }, [setFilterConfig, needsReset]);

  return [needsReset ? FILTER_DEFAULT : filterConfig, setFilterConfig];
}
