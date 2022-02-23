import { createSlice } from '@reduxjs/toolkit';
import { walletAccountsChanged } from './accountsChanged';
import { walletConnect } from './connect';
import { walletDisconnect } from './disconnect';
import { networks } from '../../config/networks';
import { Web3 } from '../../helpers/web3';
import { walletChainChanged } from './chainChanged';
import { WALLET_ACTION, WALLET_ACTION_RESET } from '../redux/constants';
import { walletSwitch } from './switch';

function initialRpc() {
  return Object.fromEntries(
    networks.map(network => {
      const rpcs = network.rpc;
      return [network.key, new Web3(rpcs[~~(rpcs.length * Math.random())])];
    })
  );
}

function initialAction() {
  return { result: null, data: null };
}

const initialState = {
  network: null,
  address: null,
  web3: null,
  provider: null,
  status: 'disconnected',
  rpc: initialRpc(),
  action: initialAction(),
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(walletConnect.pending, (state, action) => {
        state.status = 'connecting';
        state.network = null;
        state.address = null;
        state.web3 = null;
        state.provider = null;
      })
      .addCase(walletConnect.fulfilled, (state, action) => {
        state.status = 'connected';
        state.network = action.payload.network;
        state.address = action.payload.address;
        state.web3 = action.payload.web3;
        state.provider = action.payload.provider;
      })
      .addCase(walletConnect.rejected, (state, action) => {
        state.status = 'disconnected';
        state.network = null;
        state.address = null;
        state.web3 = null;
        state.provider = null;
      })
      .addCase(walletSwitch.pending, (state, action) => {})
      .addCase(walletSwitch.fulfilled, (state, action) => {
        state.network = action.payload.network;
        state.address = action.payload.address;
      })
      .addCase(walletSwitch.rejected, (state, action) => {})
      .addCase(walletDisconnect.fulfilled, (state, action) => {
        state.status = 'disconnected';
        state.network = null;
        state.address = null;
        state.web3 = null;
        state.provider = null;
      })
      .addCase(walletDisconnect.rejected, (state, action) => {
        state.status = 'disconnected';
        state.network = null;
        state.address = null;
        state.web3 = null;
        state.provider = null;
      })
      .addCase(walletAccountsChanged.pending, state => {
        state.status = 'connecting';
      })
      .addCase(walletAccountsChanged.fulfilled, (state, action) => {
        state.address = action.payload.address;
      })
      .addCase(walletAccountsChanged.rejected, state => {
        state.network = null;
        state.address = null;
        state.status = 'disconnected';
      })
      .addCase(walletChainChanged.pending, state => {
        state.status = 'connecting';
      })
      .addCase(walletChainChanged.fulfilled, (state, action) => {
        state.network = action.payload.network;
        state.status = 'connected';
      })
      .addCase(walletChainChanged.rejected, state => {
        state.network = null;
        state.address = null;
        state.status = 'disconnected';
      })
      .addCase(WALLET_ACTION, (state, action) => {
        state.action.result = action.payload.result;
        state.action.data = action.payload.data;
      })
      .addCase(WALLET_ACTION_RESET, (state, action) => {
        state.action.result = null;
        state.action.data = null;
      });
  },
});

export const walletReducer = walletSlice.reducer;
