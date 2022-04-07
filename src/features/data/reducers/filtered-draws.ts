import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkEntity } from '../entities/network';
import { fetchNetworkConfigs } from '../actions/networks';

export interface FilteredDrawsState {
  mode: 'all' | 'winning';
  networks: {
    [key: NetworkEntity['id']]: boolean;
  };
}

export const initialFilteredDrawsState: FilteredDrawsState = {
  mode: 'all',
  networks: {},
};

export const filteredDrawsSlice = createSlice({
  name: 'filtered-draws',
  initialState: initialFilteredDrawsState,
  reducers: {
    reset: state => {
      state.mode = initialFilteredDrawsState.mode;
      for (const id in state.networks) {
        state.networks[id] = true;
      }
    },
    setMode: (state, action: PayloadAction<FilteredDrawsState['mode']>) => {
      state.mode = action.payload;
    },
    setNetworks: (state, action: PayloadAction<FilteredDrawsState['networks']>) => {
      for (const id in action.payload) {
        state.networks[id] = action.payload[id];
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchNetworkConfigs.fulfilled, (state, action) => {
      for (const network of action.payload) {
        state.networks[network.id] = true;
      }
    });
  },
});

export const filteredDrawsReducer = filteredDrawsSlice.reducer;
export const filteredDrawsActions = filteredDrawsSlice.actions;
