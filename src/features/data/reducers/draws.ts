import {
  fetchDrawsForNetworkBefore,
  fetchPrizeTotalsForNetwork,
  fetchUniqueWinners,
} from '../actions/draws';
import { createSlice, Draft } from '@reduxjs/toolkit';
import { DrawEntity, PotPrizeTotalsEntity } from '../entities/draws';
import { NormalizedEntity } from '../utils/normalized-entity';

export interface DrawsState {
  byId: {
    [id: DrawEntity['id']]: DrawEntity;
  };
  allIds: DrawEntity['id'][];
  byWinningAddress: {
    [address: string]: DrawEntity['id'][];
  };
  byPotId: {
    [address: string]: DrawEntity['id'][];
  };
  totals: NormalizedEntity<PotPrizeTotalsEntity>;
  uniqueWinners: number;
}

export const initialDrawsState: DrawsState = {
  byId: {},
  allIds: [],
  byWinningAddress: {},
  byPotId: {},
  totals: {
    byId: {},
    allIds: [],
  },
  uniqueWinners: 0,
};

function addDrawToState(state: Draft<DrawsState>, draw: DrawEntity) {
  state.byId[draw.id] = draw;

  for (const winner of draw.winners) {
    if (state.byWinningAddress[winner.address] === undefined) {
      state.byWinningAddress[winner.address] = [draw.id];
    } else if (!state.byWinningAddress[winner.address].includes(draw.id)) {
      state.byWinningAddress[winner.address].push(draw.id);
    }
  }

  if (state.byPotId[draw.potId] === undefined) {
    state.byPotId[draw.potId] = [draw.id];
  } else if (!state.byPotId[draw.potId].includes(draw.id)) {
    state.byPotId[draw.potId].push(draw.id);
  }
}

function addDrawsToState(state: Draft<DrawsState>, draws: DrawEntity[]) {
  let added = false;
  for (const draw of draws) {
    if (!(draw.id in state.byId)) {
      addDrawToState(state, draw);
      added = true;
    }
  }

  if (added) {
    state.allIds = Object.keys(state.byId);
  }
}

function addTotalToState(state: Draft<DrawsState['totals']>, total: PotPrizeTotalsEntity) {
  state.byId[total.id] = total;
}

function addTotalsToState(state: Draft<DrawsState>, totals: PotPrizeTotalsEntity[]) {
  let added = false;
  for (const total of totals) {
    if (!(total.id in state.totals.byId)) {
      addTotalToState(state.totals, total);
      added = true;
    }
  }

  if (added) {
    state.totals.allIds = Object.keys(state.totals.byId);
  }
}

export const drawsSlice = createSlice({
  name: 'draws',
  initialState: initialDrawsState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDrawsForNetworkBefore.fulfilled, (state, action) => {
        if (action.payload.draws.length) {
          addDrawsToState(state, action.payload.draws);
        }
      })
      .addCase(fetchPrizeTotalsForNetwork.fulfilled, (state, action) => {
        if (action.payload.totals.length) {
          addTotalsToState(state, action.payload.totals);
        }
      })
      .addCase(fetchUniqueWinners.fulfilled, (state, action) => {
        state.uniqueWinners = action.payload;
      });
  },
});

export const drawsReducer = drawsSlice.reducer;

// export const drawListeners = createActionListeners<AppState>(builder => {
//   builder.addAfter(fetchDrawsForNetworkBefore.fulfilled, async (action, dispatch, state) => {
//     // todo
//   });
// });
