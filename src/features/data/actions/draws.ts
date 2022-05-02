import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetworkEntity } from '../entities/network';
import { AppState } from '../../../store';
import { selectNetworkById } from '../selectors/networks';
import { ApiPrizeDraw, ApiPrizeTotals, getDrawsApiForNetwork } from '../apis/draws';
import { last } from 'lodash';
import {
  selectPotById,
  selectPotIdByNetworkPrizePool,
  selectPotPrizePoolsByNetworkId,
} from '../selectors/pots';
import { DrawEntity, PotPrizeTotalsEntity } from '../entities/draws';

interface fetchDrawsForNetworkBeforeParams {
  networkId: NetworkEntity['id'];
  timestamp: number;
}

export interface fetchDrawsForNetworkBeforePayload {
  draws: DrawEntity[];
}

function mapDrawsToEntities(
  draws: ApiPrizeDraw[],
  networkId: NetworkEntity['id'],
  state: AppState
): DrawEntity[] {
  // Draws must have entry in config, and not be after the last draw at EOL.
  const prizePools = selectPotPrizePoolsByNetworkId(state, networkId).map(address =>
    address.toLowerCase()
  );

  return draws
    .filter(draw => prizePools.includes(draw.prizePool.address))
    .map(draw => ({
      ...draw,
      potId: selectPotIdByNetworkPrizePool(state, networkId, draw.prizePool.address),
    }))
    .filter(draw => {
      const pot = selectPotById(state, draw.potId);
      return pot.status !== 'eol' || draw.drawNumber <= pot.eolDrawNumber;
    });
}

export const fetchDrawsForNetworkBefore = createAsyncThunk<
  fetchDrawsForNetworkBeforePayload,
  fetchDrawsForNetworkBeforeParams,
  { state: AppState }
>('draws/fetchDrawsForNetworkBefore', async ({ networkId, timestamp }, { getState, dispatch }) => {
  const state = getState();
  const network = selectNetworkById(state, networkId);
  const api = await getDrawsApiForNetwork(network);
  const limit = 1000;
  const draws: ApiPrizeDraw[] = await api.fetchPrizeDrawsBefore(timestamp, limit);

  // Fetch more: if we fetched a full chunk, there could be more
  if (draws.length === 1000) {
    const oldest = last(draws) as ApiPrizeDraw; // we know there is at least 1 draw
    setTimeout(
      () => dispatch(fetchDrawsForNetworkBefore({ networkId, timestamp: oldest.timestamp })),
      1000
    );
  }

  if (draws.length) {
    const drawEntities = mapDrawsToEntities(draws, networkId, state);

    return {
      draws: drawEntities,
    };
  }

  // No draws found
  return { draws: [] };
});

interface fetchTotalPrizesForNetworkParams {
  networkId: NetworkEntity['id'];
}

export interface fetchTotalPrizesForNetworkPayload {
  totals: PotPrizeTotalsEntity[];
}

function mapPrizePoolTotalsToEntities(
  totals: ApiPrizeTotals[],
  networkId: NetworkEntity['id'],
  state: AppState
): PotPrizeTotalsEntity[] {
  // Draws must have entry in config, and not be after the last draw at EOL.
  const prizePools = selectPotPrizePoolsByNetworkId(state, networkId).map(address =>
    address.toLowerCase()
  );

  return totals
    .filter(total => prizePools.includes(total.prizePool))
    .map(total => ({
      ...total,
      potId: selectPotIdByNetworkPrizePool(state, networkId, total.prizePool),
    }));
}

export const fetchPrizeTotalsForNetwork = createAsyncThunk<
  fetchTotalPrizesForNetworkPayload,
  fetchTotalPrizesForNetworkParams,
  { state: AppState }
>('draws/fetchPrizeTotalsForNetwork', async ({ networkId }, { getState, dispatch }) => {
  const state = getState();
  const network = selectNetworkById(state, networkId);
  const api = await getDrawsApiForNetwork(network);
  const prizePools = selectPotPrizePoolsByNetworkId(state, networkId).map(address =>
    address.toLowerCase()
  );
  const totals: ApiPrizeTotals[] = await api.fetchTotalPrizesForPrizePools(prizePools);

  if (totals.length) {
    const totalEntities = mapPrizePoolTotalsToEntities(totals, networkId, state);
    return {
      totals: totalEntities,
    };
  }

  return {
    totals: [],
  };
});

export const fetchUniqueWinners = createAsyncThunk<number, void, { state: AppState }>(
  'draws/fetchUniqueWinners',
  async (_, { getState }) => {
    const state = getState();
    const network = selectNetworkById(state, 'bsc'); // TODO: endpoint only returns BSC so far
    const api = await getDrawsApiForNetwork(network);

    return await api.fetchUniqueWinnersCount();
  }
);
