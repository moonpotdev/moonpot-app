import { HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE } from '../constants';
import { config } from '../../../config/config';
import BigNumber from 'bignumber.js';
import { potsByNetwork } from '../../../config/vault';
import { tokensByNetworkSymbol } from '../../../config/tokens';

const initialPools = () => {
  const pools = [];

  for (let net in config) {
    const networkPools = potsByNetwork[net];
    let defaultOrder = 0;

    for (const pool of networkPools) {
      pool['network'] = net;
      pool['daily'] = 0;
      pool['apy'] = 0;
      pool['tvl'] = 0;
      pool['tokenPrice'] = 0;
      pool['prizePoolBalance'] = '0';
      pool['awardBalance'] = new BigNumber(0);
      pool['awardBalanceUsd'] = new BigNumber(0);
      pool['projectedAwardBalance'] = new BigNumber(0);
      pool['projectedAwardBalanceUsd'] = new BigNumber(0);
      pool['sponsorBalance'] = new BigNumber(0);
      pool['totalSponsorBalanceUsd'] = new BigNumber(0);
      pool['projectedTotalSponsorBalanceUsd'] = new BigNumber(0);
      pool['totalStakedUsd'] = new BigNumber(0);
      pool['numberOfWinners'] = new BigNumber(5);
      pool['totalTickets'] = '0';
      pool['defaultOrder'] = defaultOrder++;
      pool.sponsors.forEach(sponsor => {
        sponsor.sponsorBalance = new BigNumber(0);
        sponsor.sponsorBalanceUsd = new BigNumber(0);
      });
      pool.projectedSponsors = pool.sponsors.map(s => ({
        ...s,
        sponsorBalance: new BigNumber(s.sponsorBalance),
        sponsorBalanceUsd: new BigNumber(s.sponsorBalanceUsd),
      }));

      pool.bonuses = (pool.bonuses || []).map(bonus => ({
        ...bonus,
        ...tokensByNetworkSymbol[pool.network][bonus.symbol],
        apr: 0,
        apy: 0,
        compoundable: false,
        active: false,
      }));

      pools[pool.id] = pool;
    }
  }

  return pools;
};

const initialState = {
  pools: initialPools(),
  totalTvl: 0,
  totalPrizesAvailable: new BigNumber(0),
  projectedTotalPrizesAvailable: new BigNumber(0),
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
        projectedTotalPrizesAvailable: action.payload.projectedTotalPrizesAvailable,
        lastUpdated: action.payload.lastUpdated,
        isPoolsLoading: action.payload.isPoolsLoading,
        isFirstTime: false,
      };
    default:
      return state;
  }
};

export default vaultReducer;
