import { createAsyncThunk } from '@reduxjs/toolkit';
import { getNetworkApi, NetworkConfig } from '../apis/network';

export const fetchNetworkConfigs = createAsyncThunk<NetworkConfig[]>(
  'networks/fetchNetworkConfigs',
  async () => {
    const api = getNetworkApi();
    return await api.fetchNetworkConfigs();
  }
);
