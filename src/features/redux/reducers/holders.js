import { FETCH_HOLDERS_BEGIN, FETCH_HOLDERS_SUCCESS, FETCH_HOLDERS_FAILURE } from '../constants';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  holders: 0,
  players: 0,
  cadets: 0,
  loading: false,
  error: null,
};

const holdersReducer = createReducer(initialState, builder => {
  builder
    .addCase(FETCH_HOLDERS_BEGIN, (state, action) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(FETCH_HOLDERS_SUCCESS, (state, action) => {
      state.loading = false;
      state.holders = action.payload.holders;
      state.players = action.payload.players;
      state.cadets = action.payload.cadets;
    })
    .addCase(FETCH_HOLDERS_FAILURE, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    });
});

export default holdersReducer;
