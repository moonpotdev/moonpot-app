import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../../../store';
import { NetworkEntity } from '../entities/network';

export const selectNetworkById = createSelector(
  (state: AppState) => state.entities.networks.byId,
  (_: AppState, networkId: NetworkEntity['id']) => networkId,
  (networksById, networkId): NetworkEntity => {
    if (networksById[networkId] === undefined) {
      throw new Error(`selectNetworkById: Unknown network ${networkId}`);
    }

    return networksById[networkId];
  }
);

export const selectNetworkIds = (state: AppState) => state.entities.networks.allIds;
