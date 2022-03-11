import { networkIdToKey, networkSetup } from '../../../config/networks';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectWalletProvider, selectWalletWeb3 } from '../selectors';
import { getNetworkId } from './connect';

export const walletSwitch = createAsyncThunk(
  'wallet/switch',
  async (networkKey, { getState, dispatch }) => {
    // Check switch happened
    const beforeState = getState();
    const beforeProvider = selectWalletProvider(beforeState);

    // Attempt to switch
    await networkSetup(networkKey, beforeProvider);

    // Check switch happened
    const state = getState();
    const web3 = selectWalletWeb3(state);

    // get network id
    console.log('get network id');
    const networkId = await getNetworkId(web3);

    // get accounts
    console.log('get accounts');
    const accounts = await web3.eth.getAccounts();

    // return
    return {
      network: networkIdToKey(networkId),
      address: accounts && accounts.length ? accounts[0] : null,
    };
  }
);
