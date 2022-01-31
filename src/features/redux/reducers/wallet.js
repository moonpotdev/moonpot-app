import Web3 from 'web3';
import { createReducer } from '@reduxjs/toolkit';
import { networkKeys, networks } from '../../../config/networks';

function initialModals() {
  return Object.fromEntries(networkKeys.map(key => [key, null]));
}

const initialNetwork = () => {
  const storage = localStorage.getItem('moon_networks');
  return storage === null ? 'bsc' : storage;
};

const initialRpc = () => {
  return Object.fromEntries(
    networks.map(network => {
      const rpcs = network.rpc;
      return [network.key, new Web3(rpcs[~~(rpcs.length * Math.random())])];
    })
  );
};

const initialAction = () => {
  return { result: null, data: null };
};

const initialState = {
  modals: initialModals(),
  network: initialNetwork(),
  rpc: initialRpc(),
  web3modal: null,
  address: null,
  pending: false,
  action: initialAction(),
};

const walletReducer = createReducer(initialState, builder => {
  builder
    .addCase('WALLET_DISCONNECT', (state, action) => {
      state.address = null;
    })
    .addCase('WALLET_CONNECT_BEGIN', (state, action) => {
      state.pending = true;
    })
    .addCase('WALLET_CONNECT_DONE', (state, action) => {
      state.pending = false;
      state.address = action.payload.address;
    })
    .addCase('WALLET_CREATE_MODAL', (state, action) => {
      state.web3modal = action.payload.data;
    })
    .addCase('SET_NETWORK', (state, action) => {
      state.network = action.payload.network;
      state.clients = action.payload.clients;
      state.rpc = false;
    })
    .addCase('WALLET_ACTION', (state, action) => {
      state.action.result = action.payload.result;
      state.action.data = action.payload.data;
    })
    .addCase('WALLET_ACTION_RESET', (state, action) => {
      state.action.result = null;
      state.action.data = null;
    });
});

export default walletReducer;
