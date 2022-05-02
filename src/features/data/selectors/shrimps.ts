import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../../../store';
import { ShrimpEntity } from '../entities/shrimps';

export const selectHaveShrimpsLoadedOnce = (state: AppState) =>
  state.ui.dataLoader.global.shrimps.alreadyLoadedOnce;

export const selectShouldInitShrimps = (state: AppState) =>
  !state.ui.dataLoader.global.shrimps.alreadyLoadedOnce &&
  state.ui.dataLoader.global.shrimps.status === 'init';

export const selectShrimpById = createSelector(
  (state: AppState) => state.entities.shrimps.byId,
  (_: AppState, shrimpId: ShrimpEntity['id']) => shrimpId,
  (shrimpsById, shrimpId): ShrimpEntity => {
    if (shrimpsById[shrimpId] === undefined) {
      throw new Error(`selectShrimpById: Unknown shrimp ${shrimpId}`);
    }

    return shrimpsById[shrimpId];
  }
);

export const selectShrimpIdAtIndex = createSelector(
  (state: AppState) => state.entities.shrimps.allIds,
  (_: AppState, index: number) => index,
  (allIds, index): ShrimpEntity['id'] => {
    return allIds[index % allIds.length];
  }
);

// export const selectShrimpIds = (state: AppState) => state.entities.shrimps.allIds;
