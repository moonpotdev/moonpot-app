import { networkIdToKey } from '../../../config/networks';
import { getModal } from '../modal';
import { Web3 } from '../../../helpers/web3';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletDisconnect } from './disconnect';
import { walletAccountsChanged } from './accountsChanged';
import { BALANCE_RESET, EARNED_RESET } from '../../redux/constants';
import { walletChainChanged } from './chainChanged';

function createEventHandler(handler) {
  const func = function (...args) {
    if (func.active) {
      handler(...args);
    }
  };

  func.active = true;
  func.off = function () {
    func.active = false;
  };

  return func;
}

function subscribeToProvider(provider, dispatch) {
  if (!provider.on || typeof provider.on !== 'function') {
    console.log('no provider events');
    return null;
  }

  const closeHandler = createEventHandler(() => {
    console.log('closeHandler->walletDisconnect');
    dispatch(walletDisconnect());
  });

  const accountsChangedHandler = createEventHandler(accounts => {
    dispatch(walletAccountsChanged({ accounts }));
  });

  const chainChangedHandler = createEventHandler(id => {
    const chainId = Web3.utils.isHexStrict(id) ? Web3.utils.hexToNumber(id) : id;
    dispatch(walletChainChanged({ chainId }));
  });

  provider.on('close', closeHandler);
  provider.on('disconnect', closeHandler);
  provider.on('accountsChanged', accountsChangedHandler);
  provider.on('chainChanged', chainChangedHandler);

  try {
    provider.__unsubscribe = () => {
      closeHandler.off();
      accountsChangedHandler.off();
      chainChangedHandler.off();
    };
  } catch (e) {
    console.error(e);
  }
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

export async function getNetworkId(web3) {
  const networkId = await web3.eth.getChainId();
  // Trust provider returns an incorrect chainId for BSC. (Is this still true?)
  return networkId === 86 ? 56 : networkId;
}

export const walletConnect = createAsyncThunk(
  'wallet/connect',
  async (networkKey, { getState, dispatch }) => {
    const modal = getModal(networkKey);

    console.log('wait connect');
    const provider = await modal.connect();

    console.log('create web3');
    const web3 = createWeb3(provider);

    // get network id
    console.log('get network id');
    const networkId = await getNetworkId(web3);

    // get accounts
    console.log('get accounts');
    const accounts = await web3.eth.getAccounts();

    // watch disconnect/account/chain changed events
    console.log('subscribe provider');
    subscribeToProvider(provider, dispatch);

    // reset earned/balances to zero
    console.log('reset state');
    dispatch({ type: EARNED_RESET });
    dispatch({ type: BALANCE_RESET });

    // return
    console.log('return', networkKey, networkId, networkIdToKey(networkId));
    return {
      network: networkIdToKey(networkId),
      address: accounts && accounts.length ? accounts[0] : null,
      web3,
      provider,
    };
  }
);
