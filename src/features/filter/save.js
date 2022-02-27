import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectFilterConfig } from './select';
import { FILTER_STORAGE_KEY } from './constants';

export const filterSave = createAsyncThunk('filter/save', async (_, { getState }) => {
  const state = getState();
  const config = selectFilterConfig(state);

  window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(config));
});
