import { networkIdToKey } from '../../config/networks';
import { getModal } from './modal';
import Web3 from 'web3';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletDisconnect } from './disconnect';
import { walletAccountsChanged } from './accountsChanged';
import { BALANCE_RESET, EARNED_RESET } from '../redux/constants';

function subscribeToProvider(provider, networkKey, dispatch) {
  if (!provider.on || typeof provider.on !== 'function') {
    return;
  }

  provider.on('close', () => {});

  provider.on('disconnect', () => {
    dispatch(walletDisconnect());
  });

  provider.on('accountsChanged', accounts => {
    dispatch(walletAccountsChanged({ accounts, networkKey }));
  });

  provider.on('chainChanged', id => {});
}

function extendWeb3Functions(web3) {
  if (typeof web3.eth.extend === 'function') {
    web3.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: web3.utils.hexToNumber,
        },
      ],
    });
  }
}

function createWeb3(provider) {
  const web3 = new Web3(provider);
  extendWeb3Functions(web3);
  return web3;
}

async function getNetworkId(web3) {
  const networkId = await web3.eth.getChainId();
  // Trust provider returns an incorrect chainId for BSC. (Is this still true?)
  return networkId === 86 ? 56 : networkId;
}

export const walletConnect = createAsyncThunk(
  'wallet/connect',
  async (networkKey, { getState, dispatch }) => {
    const modal = getModal(networkKey);

    modal.clearCachedProvider();
    const provider = await modal.connect();
    const web3 = createWeb3(provider);

    // get network id
    const networkId = await getNetworkId(web3);

    // get accounts
    const accounts = await web3.eth.getAccounts();

    // watch disconnect/account/chain changed events
    subscribeToProvider(provider);

    // reset earned/balances to zero
    dispatch({ type: EARNED_RESET });
    dispatch({ type: BALANCE_RESET });

    return {
      network: networkIdToKey(networkId),
      address: accounts && accounts.length ? accounts[0] : null,
      web3,
      provider,
    };
  }
);
