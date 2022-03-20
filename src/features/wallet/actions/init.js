import { createAsyncThunk } from '@reduxjs/toolkit';
import { destroyWalletConnector, getWalletConnector, haveWalletConnector } from '../instances';
import {
  walletAddressChanged,
  walletConnected,
  walletDisconnected,
  walletNetworkChanged,
} from '../slice';
import { walletAutoConnect } from './autoConnect';

export const walletInit = createAsyncThunk('wallet/init', async (_, { dispatch }) => {
  if (haveWalletConnector()) {
    console.warn('Wallet already initialised; destroying old connector.');
    destroyWalletConnector();
  }

  getWalletConnector({
    onConnect: ({ network, address }) => {
      dispatch(walletConnected({ network, address }));
    },
    onDisconnect: () => {
      dispatch(walletDisconnected());
    },
    onAddressChanged: ({ address }) => {
      dispatch(walletAddressChanged({ address }));
    },
    onNetworkChanged: ({ network }) => {
      dispatch(walletNetworkChanged({ network }));
    },
  });

  dispatch(walletAutoConnect());
});
