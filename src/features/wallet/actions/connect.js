import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWalletConnector } from '../instances';

export const walletConnect = createAsyncThunk('wallet/connect', async () => {
  const wallet = getWalletConnector();
  await wallet.connect();
});
