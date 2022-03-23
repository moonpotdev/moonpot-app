import { createReducer } from '@reduxjs/toolkit';
import { fetchDraws } from './draws';
import { indexBy } from '../../../helpers/utils';
import { fetchUniqueWinners } from './unique';

const initialState = {
  draws: [],
  firstLoad: true,
  pending: false,
  hasMore: false,
  unique: {
    count: 0,
    pending: false,
    error: false,
  },
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
    })
    .addCase(fetchUniqueWinners.pending, (state, action) => {
      state.unique.pending = true;
    })
    .addCase(fetchUniqueWinners.fulfilled, (state, action) => {
      state.unique.pending = false;
      state.unique.count = action.payload.uniqueWinners;
    })
    .addCase(fetchUniqueWinners.rejected, (state, action) => {
      state.unique.pending = false;
      state.unique.error = action.error;
    });
});

export default winnersReducer;
