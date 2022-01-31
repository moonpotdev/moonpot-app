import { createSlice } from '@reduxjs/toolkit';
import { walletAccountsChanged } from './accountsChanged';
import { walletConnect } from './connect';
import { walletDisconnect } from './disconnect';

const initialState = {
  network: null,
  address: null,
  web3: null,
  provider: null,
  status: 'disconnected',
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
      .addCase(walletAccountsChanged.fulfilled, (state, action) => {
        state.address = action.payload.address;
      })
      .addCase(walletAccountsChanged.rejected, state => {
        state.network = null;
        state.address = null;
        state.status = 'disconnected';
      });
  },
});
