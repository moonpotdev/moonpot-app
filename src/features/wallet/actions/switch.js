import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWalletConnector } from '../instances';

export const walletSwitch = createAsyncThunk('wallet/switch', async networkKey => {
  const wallet = getWalletConnector();
  await wallet.switch(networkKey);
});
