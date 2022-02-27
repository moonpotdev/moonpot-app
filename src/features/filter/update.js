import { createAsyncThunk } from '@reduxjs/toolkit';
import { filterSetConfig } from './slice';
import { filterApply } from './apply';
import { filterSave } from './save';
import { selectFilterConfig } from './select';

export const filterUpdate = createAsyncThunk(
  'filter/update',
  async (requestedConfig, { getState, dispatch }) => {
    const state = getState();
    const existingConfig = selectFilterConfig(state);
    const newConfig = {};

    for (const key in existingConfig) {
      if (key in requestedConfig) {
        newConfig[key] = requestedConfig[key];
      }
    }

    console.log('filterUpdate dispatch filterSetConfig', newConfig);
    await dispatch(filterSetConfig(newConfig));
    await dispatch(filterSave());
    await dispatch(filterApply());
  }
);
