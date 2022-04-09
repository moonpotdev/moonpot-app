import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkEntity } from '../entities/network';
import { fetchNetworkConfigs } from '../actions/networks';

export interface FilteredDrawsState {
  mode: 'all' | 'winning';
  networks: {
    [key: NetworkEntity['id']]: boolean;
  };
  pots: string[];
}

export const initialFilteredDrawsState: FilteredDrawsState = {
  mode: 'all',
  networks: {},
  pots: [],
};

export const filteredDrawsSlice = createSlice({
  name: 'filtered-draws',
  initialState: initialFilteredDrawsState,
  reducers: {
    reset: state => {
      state.mode = initialFilteredDrawsState.mode;
      state.pots = [];
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
    setPots: (state, action: PayloadAction<string[]>) => {
      state.pots = action.payload;
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
