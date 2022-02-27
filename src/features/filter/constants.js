export const FILTER_DEFAULT = {
  version: 7, // Bump+1 if changes are made to force reset on end user
  sort: 'default', // Must have matching entry in FILTER_NAMED_SORTS
  deposited: false,
  category: 'featured',
  network: 'all',
  status: 'active',
};
export const FILTER_STORAGE_KEY = 'moonHomeSortConfig';
export const FILTER_NAMED_SORTS = {
  'next-draw': ['expiresAt', 'asc'],
  prize: ['projectedTotalPrizeUsd', 'desc'],
  apy: ['totalApy', 'desc'],
  default: ['defaultOrder', 'asc'],
};
