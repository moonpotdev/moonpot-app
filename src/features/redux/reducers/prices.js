import { createReducer } from '@reduxjs/toolkit';
import { networkIds } from '../../../config/networks';

const initialState = {
  prices: {},
  apy: {},
  ppfs: Object.fromEntries(networkIds.map(network => [network, {}])),
  byNetworkAddress: Object.fromEntries(networkIds.map(network => [network, {}])),
  lastUpdated: 0,
};

const pricesReducer = createReducer(initialState, builder => {
  builder.addCase('FETCH_PRICES', (state, action) => {
    state.prices = action.payload.prices;
    state.apy = action.payload.apy;
    state.ppfs = action.payload.ppfs;
    state.byNetworkAddress = action.payload.byNetworkAddress;
    state.lastUpdated = action.payload.lastUpdated;
  });
});

export default pricesReducer;
