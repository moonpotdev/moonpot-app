import { createAsyncThunk } from '@reduxjs/toolkit';
import { CACHED_PROVIDER_KEY, getLocal } from 'web3modal';
import { walletConnect } from './connect';

export const walletAutoConnect = createAsyncThunk('wallet/autoConnect', async (_, { dispatch }) => {
  const savedProvider = getLocal(CACHED_PROVIDER_KEY);

  if (!savedProvider) {
    return false;
  }

  dispatch(walletConnect());
  return true;
});
