import { createSlice } from '@reduxjs/toolkit';
import { potsAll } from '../../config/vault';
import { filterApply } from './apply';
import { filterLoad } from './load';
import { FILTER_DEFAULT } from './constants';
import { addAfterListener } from '../redux/middleware/events';
import { filterSave } from './save';

const initialState = {
  config: { ...FILTER_DEFAULT },
  configLoaded: false,
  mode: 'moonpots',
  ids: Object.keys(potsAll),
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setConfig: (state, action) => {
      console.log('Setting config...', action.payload);
      for (const key in action.payload) {
        state.config[key] = action.payload[key];
      }
    },
    setMode: (state, action) => {
      console.log('Setting mode...', action.payload);
      state.mode = action.payload;
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

addAfterListener(filterSlice.actions.setMode.type, ({ dispatch }) => {
  console.log('applying filter after mode set');
  dispatch(filterApply());
});

addAfterListener(filterSlice.actions.setConfig.type, ({ dispatch }) => {
  console.log('saving config after config set');
  dispatch(filterSave());

  console.log('applying filter after config set');
  dispatch(filterApply());
});

export const filterReducer = filterSlice.reducer;
export const filterSetConfig = filterSlice.actions.setConfig;
export const filterSetMode = filterSlice.actions.setMode;
