import { AppState } from '../../../store';
import { createSelector } from '@reduxjs/toolkit';
import { DrawEntity } from '../entities/draws';
import { ZERO } from '../../../helpers/utils';
import { tokensByNetworkAddress } from '../../../config/tokens';
import { byDecimals } from '../../../helpers/format';
import BigNumber from 'bignumber.js';
import { NetworkEntity } from '../entities/network';

export const selectShouldInitDraws = (state: AppState) =>
  state.ui.dataLoader.global.draws.status === 'init';

export const selectHaveAllNetworkDrawsLoadedOnce = (state: AppState) =>
  state.entities.networks.allIds.every(
    id =>
      state.ui.dataLoader.byNetworkId[id] !== undefined &&
      state.ui.dataLoader.byNetworkId[id].draws.alreadyLoadedOnce
  );

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

export const selectDrawsByIds = createSelector(
  (state: AppState) => state.entities.draws.byId,
  (state: AppState, drawIds: DrawEntity['id'][]) => drawIds,
  (drawsById, drawIds) => drawIds.map(id => drawsById[id])
);

export const selectDrawIdsByWinningAddress = createSelector(
  (state: AppState) => state.entities.draws.byWinningAddress,
  (state: AppState, address: string) => address.toLowerCase(),
  (byWinningAddress, address) => byWinningAddress[address] || []
);

export const selectNetworksShouldInitPrizeTotals = (state: AppState): NetworkEntity['id'][] =>
  state.entities.networks.allIds.filter(
    id =>
      state.ui.dataLoader.byNetworkId[id] === undefined ||
      state.ui.dataLoader.byNetworkId[id].prizeTotals.status === 'init'
  );

export const selectHaveAnyNetworkPrizeTotalsLoadedOnce = (state: AppState) =>
  state.entities.networks.allIds.some(
    id =>
      state.ui.dataLoader.byNetworkId[id] !== undefined &&
      state.ui.dataLoader.byNetworkId[id].prizeTotals.alreadyLoadedOnce
  );

export const selectHaveAllNetworkPrizeTotalsLoadedOnce = (state: AppState) =>
  state.entities.networks.allIds.every(
    id =>
      state.ui.dataLoader.byNetworkId[id] !== undefined &&
      state.ui.dataLoader.byNetworkId[id].prizeTotals.alreadyLoadedOnce
  );

export const selectAllPrizeTotals = createSelector(
  (state: AppState) => state.entities.draws.totals.byId,
  (state: AppState) => state.entities.draws.totals.allIds,
  (totalsById, totalIds) => totalIds.map(id => totalsById[id])
);

export const selectTotalPrizeValue = createSelector(
  (state: AppState) => state.entities.draws.totals.allIds,
  (state: AppState) => state.entities.draws.totals.byId,
  (state: AppState): Record<string, Record<string, number>> => state.prices.byNetworkAddress,
  () => tokensByNetworkAddress,
  (totalIds, totalsById, pricesByNetworkAddress, tokensByNetworkAddress) => {
    let sum = ZERO;

    for (const totalId of totalIds) {
      const total = totalsById[totalId];
      const pricesByAddress = pricesByNetworkAddress[total.networkId];
      const tokensByAddress = tokensByNetworkAddress[total.networkId];

      for (const { token, amount } of total.awards) {
        const tokenData = tokensByAddress[token.toLowerCase()];
        if (tokenData) {
          const numericAmount = byDecimals(amount, tokenData.decimals);
          const price = new BigNumber(pricesByAddress[tokenData.address] || 0);
          sum = sum.plus(numericAmount.multipliedBy(price));
        } else {
          console.error(`No token for ${token} on ${total.networkId} found`);
        }
      }
    }

    return sum.toNumber();
  }
);
