import { createAsyncThunk } from '@reduxjs/toolkit';
import { filterUpdate } from './update';
import { FILTER_DEFAULT, FILTER_STORAGE_KEY } from './constants';

function configNeedsReset(config) {
  return !config || !('version' in config) || config.version < FILTER_DEFAULT.version;
}

export const filterLoad = createAsyncThunk('filter/load', async (_, { dispatch }) => {
  const item = window.localStorage.getItem(FILTER_STORAGE_KEY);
  const parsed = JSON.parse(item);

  await dispatch(filterUpdate(configNeedsReset(parsed) ? FILTER_DEFAULT : parsed));

  return true;
});
