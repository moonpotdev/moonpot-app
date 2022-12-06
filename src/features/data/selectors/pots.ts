import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../../../store';
import { NetworkEntity } from '../entities/network';

// TODO: types
type PotEntity = any;

export const selectPotById = createSelector(
  (state: AppState): Record<string, PotEntity> => state.vault.pools,
  (_: AppState, potId: string) => potId,
  (potsById, potId): PotEntity => {
    if (potsById[potId] === undefined) {
      throw new Error(`No pot found with id ${potId}`);
    }

    return potsById[potId];
  }
);

export const selectPotsByNetworkId = createSelector(
  (state: AppState) => Object.values(state.vault.pools),
  (_: AppState, networkId: NetworkEntity['id']) => networkId,
  (pots, networkId): PotEntity[] => {
    return pots.filter(pool => pool.network === networkId);
  }
);

export const selectPotIdByNetworkPrizePool = createSelector(
  (state: AppState, networkId: NetworkEntity['id']) => selectPotsByNetworkId(state, networkId),
  (_: AppState, _2: NetworkEntity['id'], prizePool: string) => prizePool.toLowerCase(),
  (pots, prizePool): string => {
    const pot = pots.find((pool: PotEntity) => pool.prizePoolAddress?.toLowerCase() === prizePool);
    if (pot === undefined) {
      throw new Error(`No pot found with prize pool ${prizePool}`);
    }

    return pot.id;
  }
);

export const selectPotPrizePoolsByNetworkId = createSelector(
  (state: AppState, networkId: NetworkEntity['id']) => selectPotsByNetworkId(state, networkId),
  (pools: PotEntity[]): string[] => {
    return pools
      .filter(pool => !!pool.prizePoolAddress)
      .map(pool => pool.prizePoolAddress as string);
  }
);
