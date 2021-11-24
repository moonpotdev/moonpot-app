import { HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE } from '../constants';
import { config } from '../../../config/config';
import BigNumber from 'bignumber.js';
import { potsByNetwork } from '../../../config/vault';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';
import { ZERO } from '../../../helpers/utils';

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
      pool['ppfs'] = 1;
      pool['fairplayFee'] =
        pool.fairplayTicketFee /
        (tokensByNetworkAddress[pool.network][pool.rewardAddress.toLowerCase()].stakedMultiplier ||
          1);
      pool['prizePoolBalance'] = '0';
      pool['awardBalance'] = ZERO;
      pool['awardBalanceUsd'] = ZERO;
      pool['projectedAwardBalance'] = ZERO;
      pool['projectedAwardBalanceUsd'] = ZERO;
      pool['sponsorBalance'] = ZERO;
      pool['totalSponsorBalanceUsd'] = ZERO;
      pool['projectedTotalSponsorBalanceUsd'] = ZERO;
      pool['totalStakedUsd'] = ZERO;
      pool['rewardPoolRate'] = ZERO;
      pool['rewardPoolTotalSupply'] = ZERO;
      pool['numberOfWinners'] = new BigNumber(5);
      pool['totalTickets'] = '0';
      pool['defaultOrder'] = defaultOrder++;
      pool.sponsors.forEach(sponsor => {
        sponsor.sponsorBalance = ZERO;
        sponsor.sponsorBalanceUsd = ZERO;
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
  totalPrizesAvailable: ZERO,
  projectedTotalPrizesAvailable: ZERO,
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
