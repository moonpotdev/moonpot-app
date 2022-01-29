import { EARNED_FETCH_EARNED_BEGIN, EARNED_FETCH_EARNED_DONE, EARNED_RESET } from '../constants';
import { potsByNetwork } from '../../../config/vault';
import { createReducer } from '@reduxjs/toolkit';
import { networkKeys } from '../../../config/networks';

const initialEarned = (() => {
  const earned = [];
  for (const networkKey of networkKeys) {
    for (const pot of potsByNetwork[networkKey]) {
      earned[pot.id] = {};
      if ('bonuses' in pot && pot.bonuses.length) {
        for (const bonus of pot.bonuses) {
          earned[pot.id][bonus.id] = '0';
        }
      }
    }
  }

  return earned;
})();

const initialState = {
  earned: initialEarned,
  lastUpdated: 0,
  isEarnedLoading: false,
  isEarnedFirstTime: true,
};

const earnedReducer = createReducer(initialState, builder => {
  builder
    .addCase(EARNED_FETCH_EARNED_BEGIN, (state, action) => {
      state.isBalancesLoading = state.isEarnedFirstTime;
    })
    .addCase(EARNED_FETCH_EARNED_DONE, (state, action) => {
      state.earned = action.payload.earned;
      state.lastUpdated = action.payload.lastUpdated;
      state.isEarnedLoading = false;
      state.isEarnedFirstTime = false;
    })
    .addCase(EARNED_RESET, (state, action) => {
      for (const key in initialState) {
        state[key] = initialState[key];
      }
    });
});

export default earnedReducer;
