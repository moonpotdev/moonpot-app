import { createSlice } from '@reduxjs/toolkit';
import { potsAll } from '../../config/vault';
import { filterApply } from './apply';
import { filterLoad } from './load';
import { FILTER_DEFAULT } from './constants';

const initialState = {
  config: { ...FILTER_DEFAULT },
  configLoaded: false,
  ids: Object.keys(potsAll),
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setConfig: (state, action) => {
      console.log('Saving config...', action.payload);
      for (const key in action.payload) {
        state.config[key] = action.payload[key];
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(filterApply.fulfilled, (state, action) => {
        state.ids = action.payload;
      })
      .addCase(filterLoad.pending, (state, action) => {
        state.configLoaded = true;
      });
  },
});

export const filterReducer = filterSlice.reducer;
export const filterSetConfig = filterSlice.actions.setConfig;
