import { createReducer } from '@reduxjs/toolkit';
import {
  fetchEligibleInfo,
  fetchPromoCodes,
  NFT_PROMO_CLAIM_COMPLETE,
  NFT_PROMO_CLAIM_PENDING,
} from './nftPromoCodes';

const initialState = {
  pending: false,
  tokenIds: [],
  codeIds: [],
  promoCodes: [],
};

const promoCodesReducer = createReducer(initialState, builder => {
  builder
    .addCase(fetchEligibleInfo.pending, state => {
      state.pending = true;
    })
    .addCase(fetchEligibleInfo.fulfilled, (state, action) => {
      state.pending = false;
      state.tokenIds = action.payload.tokenIds;
      state.codeIds = action.payload.codes;
      state.promoCodes = [];
    })
    .addCase(fetchEligibleInfo.rejected, (state, action) => {
      console.log('error', action);
      state.pending = false;
    })
    .addCase(fetchPromoCodes.pending, state => {
      state.pending = true;
    })
    .addCase(fetchPromoCodes.fulfilled, (state, action) => {
      state.pending = false;
      state.promoCodes = action.payload;
    })
    .addCase(fetchPromoCodes.rejected, (state, action) => {
      console.log('error', action);
      state.pending = false;
    })
    .addCase(NFT_PROMO_CLAIM_PENDING, (state, action) => {
      state.pending = true;
    })
    .addCase(NFT_PROMO_CLAIM_COMPLETE, (state, action) => {
      state.pending = false;
    });
});

export default promoCodesReducer;
