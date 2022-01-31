import { createAsyncThunk } from '@reduxjs/toolkit';
import { getModal } from './modal';
import { selectWalletNetwork, selectWalletProvider } from './selectors';
import { BALANCE_RESET, EARNED_RESET } from '../redux/constants';

function unsubscribeFromProvider(provider) {
  if (!provider.off || typeof provider.off !== 'function') {
    return;
  }

  provider.off('close');
  provider.off('disconnect');
  provider.off('accountsChanged');
  provider.off('chainChanged');
}

export const walletDisconnect = createAsyncThunk(
  'wallet/disconnect',
  async (_, { getState, dispatch }) => {
    const state = getState();

    // attempt to unsubscribe from events
    const provider = selectWalletProvider(state);
    if (provider) {
      unsubscribeFromProvider(provider);
    }

    // clear cached provider so user can choose another wallet
    const networkKey = selectWalletNetwork(state);
    if (networkKey) {
      const modal = getModal(networkKey);
      modal.clearCachedProvider();
    }

    // reset earned/balances to zero
    dispatch({ type: EARNED_RESET });
    dispatch({ type: BALANCE_RESET });

    return {
      lastNetwork: networkKey,
    };
  }
);
