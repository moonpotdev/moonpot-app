import { createAsyncThunk } from '@reduxjs/toolkit';
import { networkIdToKey } from '../../config/networks';

export const walletChainChanged = createAsyncThunk('wallet/chain-changed', async ({ chainId }) => {
  const networkKey = networkIdToKey(chainId);

  return {
    network: networkKey,
  };
});
