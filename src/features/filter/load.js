import { createAsyncThunk } from '@reduxjs/toolkit';
import { FILTER_DEFAULT, FILTER_STORAGE_KEY } from './constants';
import { filterSetConfig } from './slice';

function configNeedsReset(config) {
  return !config || !('version' in config) || config.version < FILTER_DEFAULT.version;
}

export const filterLoad = createAsyncThunk('filter/load', async (_, { dispatch }) => {
  const item = window.localStorage.getItem(FILTER_STORAGE_KEY);
  const parsed = JSON.parse(item);

  await dispatch(filterSetConfig(configNeedsReset(parsed) ? FILTER_DEFAULT : parsed));

  return true;
});
