import { HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_DONE } from '../constants';
import { config } from '../../../config/config';
import BigNumber from 'bignumber.js';
import { potsByNetwork } from '../../../config/vault';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';
import { ZERO } from '../../../helpers/utils';
import { createReducer } from '@reduxjs/toolkit';

const initialPools = () => {
  const pools = [];

  for (let net in config) {
    const networkPools = potsByNetwork[net];
    let defaultOrder = 0;

    for (const pool of networkPools) {
      pool['network'] = net;
      pool['daily'] = 0;
      pool['apy'] = 0;
      pool['totalApy'] = 0;
      pool['tvl'] = 0;
      pool['tokenPrice'] = 0;
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
      pool['totalPrizeUsd'] = ZERO;
      pool['projectedTotalPrizeUsd'] = ZERO;
      pool['totalStakedUsd'] = ZERO;
      pool['numberOfWinners'] = new BigNumber(5);
      pool['totalTickets'] = '0';
      pool['stakeMax'] = '0';
      pool['isPrizeOnly'] =
        !('interestBreakdown' in pool) ||
        !('interest' in pool.interestBreakdown) ||
        !pool.interestBreakdown.interest;
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

const vaultReducer = createReducer(initialState, builder => {
  builder
    .addCase(HOME_FETCH_POOLS_BEGIN, (state, action) => {
      state.isPoolsLoading = state.isFirstTime;
    })
    .addCase(HOME_FETCH_POOLS_DONE, (state, action) => {
      state.pools = action.payload.pools;
      state.totalTvl = action.payload.totalTvl;
      state.totalPrizesAvailable = action.payload.totalPrizesAvailable;
      state.projectedTotalPrizesAvailable = action.payload.projectedTotalPrizesAvailable;
      state.lastUpdated = action.payload.lastUpdated;
      state.isPoolsLoading = action.payload.isPoolsLoading;
      state.isFirstTime = false;
    });
});

export default vaultReducer;
