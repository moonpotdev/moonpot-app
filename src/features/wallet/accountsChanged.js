import { createAsyncThunk } from '@reduxjs/toolkit';
import { BALANCE_RESET, EARNED_RESET } from '../redux/constants';
import { walletDisconnect } from './disconnect';

export const walletAccountsChanged = createAsyncThunk(
  'wallet/accounts-changed',
  async ({ accounts }, { dispatch }) => {
    // new account
    if (accounts && accounts.length) {
      // reset earned/balances to zero
      dispatch({ type: EARNED_RESET });
      dispatch({ type: BALANCE_RESET });

      return {
        address: accounts[0],
      };
    }

    // no accounts, disconnect
    dispatch(walletDisconnect());

    return {
      address: null,
    };
  }
);
