import { HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE } from '../constants';
import { config } from '../../../config/config';
import BigNumber from 'bignumber.js';

const initialPools = () => {
  const pools = [];

  for (let net in config) {
    const data = require('../../../config/vault/' + net + '.js');
    let defaultOrder = 0;

    for (const pool of data.pools) {
      pool['network'] = net;
      pool['daily'] = 0;
      pool['apy'] = 0;
      pool['tvl'] = 0;
      pool['awardBalance'] = new BigNumber(0);
      pool['sponsorBalance'] = new BigNumber(0);
      pool['totalSponsorBalanceUsd'] = new BigNumber(0);
      pool['totalStakedUsd'] = new BigNumber(0);
      pool['numberOfWinners'] = new BigNumber(5);
      pool['defaultOrder'] = defaultOrder++;
      pool.sponsors.forEach(sponsor => {
        sponsor.sponsorBalance = new BigNumber(0);
        sponsor.sponsorBalanceUsd = new BigNumber(0);
      });
      pools[pool.id] = pool;
    }
  }

  return pools;
};

const initialState = {
  pools: initialPools(),
  totalTvl: 0,
  totalPrizesAvailable: new BigNumber(0),
  lastUpdated: 0,
  isPoolsLoading: false,
  isFirstTime: true,
};

const vaultReducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_FETCH_POOLS_BEGIN:
      return {
        ...state,
        isPoolsLoading: state.isFirstTime,
      };
    case HOME_FETCH_POOLS_DONE:
      return {
        ...state,
        pools: action.payload.pools,
        totalTvl: action.payload.totalTvl,
        totalPrizesAvailable: action.payload.totalPrizesAvailable,
        lastUpdated: action.payload.lastUpdated,
        isPoolsLoading: action.payload.isPoolsLoading,
        isFirstTime: false,
      };
    default:
      return state;
  }
};

export default vaultReducer;
