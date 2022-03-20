import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWalletConnector } from '../instances';

export const walletDisconnect = createAsyncThunk('wallet/disconnect', async (_, { dispatch }) => {
  const wallet = getWalletConnector();
  await wallet.disconnect();
});
