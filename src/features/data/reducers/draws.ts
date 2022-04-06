import { fetchDrawsForNetworkBefore } from '../actions/draws';
import { createSlice, Draft } from '@reduxjs/toolkit';
import { DrawEntity } from '../entities/draws';

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
}

export const initialDrawsState: DrawsState = {
  byId: {},
  allIds: [],
  byWinningAddress: {},
  byPotId: {},
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

export const drawsSlice = createSlice({
  name: 'draws',
  initialState: initialDrawsState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDrawsForNetworkBefore.fulfilled, (state, action) => {
      if (action.payload.draws.length) {
        addDrawsToState(state, action.payload.draws);
      }
    });
  },
});

export const drawsReducer = drawsSlice.reducer;

// export const drawListeners = createActionListeners<AppState>(builder => {
//   builder.addAfter(fetchDrawsForNetworkBefore.fulfilled, async (action, dispatch, state) => {
//     // todo
//   });
// });
