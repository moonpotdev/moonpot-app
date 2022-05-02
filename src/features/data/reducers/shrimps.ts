import { NormalizedEntity } from '../utils/normalized-entity';
import { createSlice } from '@reduxjs/toolkit';
import { ShrimpEntity } from '../entities/shrimps';
import { fetchShrimps } from '../actions/shrimps';

export type ShrimpsState = NormalizedEntity<ShrimpEntity>;

export const initialShrimpsState: ShrimpsState = {
  byId: {},
  allIds: [],
};

export const shrimpsSlice = createSlice({
  name: 'shrimps',
  initialState: initialShrimpsState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchShrimps.fulfilled, (state, action) => {
      for (const shrimp of action.payload) {
        state.byId[shrimp.id] = shrimp;
      }

      state.allIds = Object.keys(state.byId);
    });
  },
});

export const shrimpsReducer = shrimpsSlice.reducer;
