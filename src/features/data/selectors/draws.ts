import { AppState } from '../../../store';
import { createSelector } from '@reduxjs/toolkit';
import { DrawEntity } from '../entities/draws';
import { orderBy } from 'lodash';

export const selectShouldInitDraws = (state: AppState) =>
  state.ui.dataLoader.global.draws.status === 'init';

export const selectHaveDrawsLoadedOnce = (state: AppState) =>
  state.ui.dataLoader.global.draws.alreadyLoadedOnce;

export const selectAllDrawIds = (state: AppState) => state.entities.draws.allIds;

export const selectDrawById = createSelector(
  (state: AppState) => state.entities.draws.byId,
  (_: AppState, drawId: DrawEntity['id']) => drawId,
  (drawsById, drawId): DrawEntity => {
    if (drawsById[drawId] === undefined) {
      throw new Error(`selectDrawById: Unknown draw ${drawId}`);
    }

    return drawsById[drawId];
  }
);

export const selectAllDraws = createSelector(
  (state: AppState) => state.entities.draws.byId,
  (state: AppState) => selectAllDrawIds(state),
  (drawsById, drawIds) => drawIds.map(id => drawsById[id])
);

export const selectFilteredDraws = (state: AppState): DrawEntity['id'][] => {
  const draws = selectAllDraws(state);

  return orderBy<DrawEntity>(draws, ['timestamp'], ['desc']).map(draw => draw.id);
};
