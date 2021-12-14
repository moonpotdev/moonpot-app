import { createReducer } from '@reduxjs/toolkit';
import { fetchDraws } from './draws';
import { indexBy } from '../../../helpers/utils';

const initialState = {
  draws: [],
  firstLoad: true,
  pending: false,
  hasMore: false,
};

const winnersReducer = createReducer(initialState, builder => {
  builder
    .addCase(fetchDraws.pending, state => {
      state.pending = true;
    })
    .addCase(fetchDraws.fulfilled, (state, action) => {
      if (action.payload.draws.length) {
        const deduplicated = indexBy(state.draws, 'id');

        action.payload.draws.forEach(draw => (deduplicated[draw.id] = draw));

        const sorted = Object.values(deduplicated);
        sorted.sort((a, b) => {
          return (a.timestamp < b.timestamp) - (a.timestamp > b.timestamp);
        });

        state.draws = sorted;
      }

      state.hasMore = action.payload.hasMore;
      state.pending = false;
      state.firstLoad = false;
    })
    .addCase(fetchDraws.rejected, (state, action) => {
      console.log('error', action);
      state.pending = false;
      state.firstLoad = false;
    });
});

export default winnersReducer;
