import { EARNED_FETCH_EARNED_BEGIN, EARNED_FETCH_EARNED_DONE, EARNED_RESET } from '../constants';
import { config } from '../../../config/config';
import { potsByNetwork } from '../../../config/vault';
import { createReducer } from '@reduxjs/toolkit';

const initialEarned = (() => {
  const earned = [];
  for (let net in config) {
    for (const pot of potsByNetwork[net]) {
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
