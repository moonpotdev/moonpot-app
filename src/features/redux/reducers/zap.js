import { ZAP_SWAP_ESTIMATE_COMPLETE, ZAP_SWAP_ESTIMATE_PENDING } from '../constants';
import { createReducer } from '@reduxjs/toolkit';

const initialState = {};

const zapReducer = createReducer(initialState, builder => {
  builder
    .addCase(ZAP_SWAP_ESTIMATE_PENDING, (state, action) => {
      state[action.payload.requestId] = {
        ...(state[action.payload.requestId] || {}),
        ...action.payload,
        pending: true,
      };
    })
    .addCase(ZAP_SWAP_ESTIMATE_COMPLETE, (state, action) => {
      state[action.payload.requestId] = {
        ...(state[action.payload.requestId] || {}),
        ...action.payload,
        pending: false,
      };
    });
});

export default zapReducer;
