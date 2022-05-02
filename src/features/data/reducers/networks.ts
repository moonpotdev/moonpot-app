import { NetworkEntity } from '../entities/network';
import { NormalizedEntity } from '../utils/normalized-entity';
import { createSlice } from '@reduxjs/toolkit';
import { fetchNetworkConfigs } from '../actions/networks';

export type NetworksState = NormalizedEntity<NetworkEntity>;

export const initialNetworksState: NetworksState = {
  byId: {},
  allIds: [],
};

export const networksSlice = createSlice({
  name: 'networks',
  initialState: initialNetworksState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchNetworkConfigs.fulfilled, (state, action) => {
      for (const network of action.payload) {
        state.byId[network.id] = network;
      }

      state.allIds = Object.keys(state.byId);
    });
  },
});

export const networksReducer = networksSlice.reducer;
