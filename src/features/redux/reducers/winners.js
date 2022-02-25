import { FETCH_WINNERS_BEGIN, FETCH_WINNERS_SUCCESS, FETCH_WINNERS_FAILURE } from '../constants';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  uniqueWinners: null,
  loading: false,
  error: null,
};

const winnersReducer = createReducer(initialState, builder => {
  builder
    .addCase(FETCH_WINNERS_BEGIN, (state, action) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(FETCH_WINNERS_SUCCESS, (state, action) => {
      state.loading = false;
      state.uniqueWinners = action.payload.uniqueWinners;
    })
    .addCase(FETCH_WINNERS_FAILURE, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    });
});

export default winnersReducer;
