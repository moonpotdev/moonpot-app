import { createSlice } from '@reduxjs/toolkit';
import { walletConnect } from './actions';
import { networks } from '../../config/networks';
import { Web3 } from '../../helpers/web3';
import {
  BALANCE_RESET,
  EARNED_RESET,
  WALLET_ACTION,
  WALLET_ACTION_RESET,
} from '../redux/constants';
import { addAfterListener } from '../redux/middleware/events';

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
  status: 'disconnected',
  rpc: initialRpc(),
  action: initialAction(),
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connected: (state, action) => {
      state.status = 'connected';
      state.network = action.payload.network;
      state.address = action.payload.address;
    },
    disconnected: state => {
      state.status = 'disconnected';
      state.network = null;
      state.address = null;
    },
    networkChanged: (state, action) => {
      state.network = action.payload.network;
    },
    addressChanged: (state, action) => {
      state.address = action.payload.address;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(walletConnect.pending, (state, action) => {
        state.status = 'connecting';
        state.network = null;
        state.address = null;
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

addAfterListener(walletSlice.actions.disconnected.type, ({ dispatch }) => {
  // Reset earned/balances on disconnect
  console.log('after disconnect: reset earned/balances');
  dispatch({ type: EARNED_RESET });
  dispatch({ type: BALANCE_RESET });
});

addAfterListener(walletSlice.actions.addressChanged.type, ({ dispatch }) => {
  // Reset earned/balances after address change
  console.log('after address changed: reset earned/balances');
  dispatch({ type: EARNED_RESET });
  dispatch({ type: BALANCE_RESET });
});

export const walletReducer = walletSlice.reducer;
export const walletConnected = walletSlice.actions.connected;
export const walletDisconnected = walletSlice.actions.disconnected;
export const walletAddressChanged = walletSlice.actions.addressChanged;
export const walletNetworkChanged = walletSlice.actions.networkChanged;
