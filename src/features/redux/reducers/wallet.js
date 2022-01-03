import { config } from '../../../config/config';
import Web3 from 'web3';
import { createReducer } from '@reduxjs/toolkit';

const initialCurrency = () => {
  const storage = localStorage.getItem('moon_site_currency');
  return storage === null ? 'usd' : storage;
};

const initialNetwork = () => {
  const storage = localStorage.getItem('moon_networks');
  return storage === null ? 'bsc' : storage;
};

const initialRpc = () => {
  const rpc = [];

  for (let network in config) {
    const c = config[network].rpc;
    rpc[network] = new Web3(c[~~(c.length * Math.random())]);
  }

  return rpc;
};

const initialAction = () => {
  return { result: null, data: null };
};

const initialExplorer = () => {
  const explorers = [];

  for (let key in config) {
    explorers[key] = config[key].explorerUrl;
  }

  return explorers;
};

const initialState = {
  network: initialNetwork(),
  currency: initialCurrency(),
  rpc: initialRpc(),
  web3modal: null,
  address: null,
  pending: false,
  explorer: initialExplorer(),
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
    .addCase('SET_CURRENCY', (state, action) => {
      state.currency = action.payload.currency;
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
