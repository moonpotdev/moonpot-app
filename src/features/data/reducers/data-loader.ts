import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createSlice,
  Draft,
  SerializedError,
} from '@reduxjs/toolkit';
import { fetchNetworkConfigs } from '../actions/networks';
import { NetworkEntity } from '../entities/network';
import { fetchDrawsForNetworkBefore, fetchPrizeTotalsForNetwork } from '../actions/draws';
import {
  AsyncThunkFulfilledActionCreator,
  AsyncThunkPendingActionCreator,
  AsyncThunkRejectedActionCreator,
} from '@reduxjs/toolkit/dist/createAsyncThunk';
import { fetchShrimps } from '../actions/shrimps';

interface LoaderStateInit {
  alreadyLoadedOnce: boolean;
  status: 'init';
  error: null;
}

interface LoaderStatePending {
  alreadyLoadedOnce: boolean;
  status: 'pending';
  error: null;
}

interface LoaderStateRejected {
  alreadyLoadedOnce: boolean;
  status: 'rejected';
  error: SerializedError;
}

interface LoaderStateFulfilled {
  alreadyLoadedOnce: boolean;
  status: 'fulfilled';
  error: null;
}

export type LoaderState =
  | LoaderStateInit
  | LoaderStatePending
  | LoaderStateRejected
  | LoaderStateFulfilled;

export interface DataLoaderState {
  global: {
    networks: LoaderState;
    draws: LoaderState;
    shrimps: LoaderState;
  };
  byNetworkId: {
    [networkId: NetworkEntity['id']]: {
      draws: LoaderState;
      prizeTotals: LoaderState;
    };
  };
}

const dataLoaderStateInit: LoaderState = {
  alreadyLoadedOnce: false,
  status: 'init',
  error: null,
};

const dataLoaderStateInitByNetworkId: DataLoaderState['byNetworkId']['bsc'] = {
  draws: dataLoaderStateInit,
  prizeTotals: dataLoaderStateInit,
};

export const initialDataLoaderState: DataLoaderState = {
  global: {
    networks: dataLoaderStateInit,
    draws: dataLoaderStateInit,
    shrimps: dataLoaderStateInit,
  },
  byNetworkId: {},
};

function setGlobalPending(
  stateKey: keyof DataLoaderState['global'],
  state: Draft<DataLoaderState>
) {
  state.global[stateKey].status = 'pending';
  state.global[stateKey].error = null;
}

function setGlobalRejected<ActionCreator extends AsyncThunkRejectedActionCreator<any, {}>>(
  stateKey: keyof DataLoaderState['global'],
  state: Draft<DataLoaderState>,
  action: ReturnType<ActionCreator>
) {
  state.global[stateKey].status = 'rejected';
  state.global[stateKey].error = action.error;
}

function setGlobalFulfilled(
  stateKey: keyof DataLoaderState['global'],
  state: Draft<DataLoaderState>
) {
  state.global[stateKey].status = 'fulfilled';
  state.global[stateKey].error = null;
  state.global[stateKey].alreadyLoadedOnce = true;
}

function addGlobalReducers(
  builder: ActionReducerMapBuilder<DataLoaderState>,
  thunk: AsyncThunk<any, any, {}>,
  stateKey: keyof DataLoaderState['global']
) {
  builder.addCase(thunk.pending, state => {
    setGlobalPending(stateKey, state);
  });
  builder.addCase(thunk.rejected, (state, action) => {
    setGlobalRejected(stateKey, state, action);
  });
  builder.addCase(thunk.fulfilled, state => {
    setGlobalFulfilled(stateKey, state);
  });
}

function setByNetworkPending<ActionArgs extends { networkId: NetworkEntity['id'] }>(
  stateKey: keyof DataLoaderState['byNetworkId']['bsc'],
  state: Draft<DataLoaderState>,
  action: ReturnType<AsyncThunkPendingActionCreator<ActionArgs, {}>>
) {
  const networkId = action.meta.arg.networkId;
  if (state.byNetworkId[networkId] === undefined) {
    state.byNetworkId[networkId] = { ...dataLoaderStateInitByNetworkId };
  }

  state.byNetworkId[networkId][stateKey] = {
    status: 'pending',
    error: null,
    alreadyLoadedOnce: state.byNetworkId[networkId][stateKey].alreadyLoadedOnce,
  };
}

function setByNetworkRejected<ActionArgs extends { networkId: NetworkEntity['id'] }>(
  stateKey: keyof DataLoaderState['byNetworkId']['bsc'],
  state: Draft<DataLoaderState>,
  action: ReturnType<AsyncThunkRejectedActionCreator<ActionArgs, {}>>
) {
  const networkId = action.meta.arg.networkId;
  if (state.byNetworkId[networkId] === undefined) {
    state.byNetworkId[networkId] = { ...dataLoaderStateInitByNetworkId };
  }

  state.byNetworkId[networkId][stateKey] = {
    status: 'rejected',
    error: action.error,
    alreadyLoadedOnce: state.byNetworkId[networkId][stateKey].alreadyLoadedOnce,
  };
}

function setByNetworkFulfilled<ActionArgs extends { networkId: NetworkEntity['id'] }>(
  stateKey: keyof DataLoaderState['byNetworkId']['bsc'],
  state: Draft<DataLoaderState>,
  action: ReturnType<AsyncThunkFulfilledActionCreator<any, ActionArgs>>
) {
  const networkId = action.meta.arg.networkId;
  if (state.byNetworkId[networkId] === undefined) {
    state.byNetworkId[networkId] = { ...dataLoaderStateInitByNetworkId };
  }

  state.byNetworkId[networkId][stateKey] = {
    status: 'fulfilled',
    error: null,
    alreadyLoadedOnce: true,
  };
}

function addByNetworkReducers<ActionArgs extends { networkId: NetworkEntity['id'] }>(
  builder: ActionReducerMapBuilder<DataLoaderState>,
  thunk: AsyncThunk<any, ActionArgs, {}>,
  stateKey: keyof DataLoaderState['byNetworkId']['bsc']
) {
  builder.addCase(thunk.pending, (state, action) => {
    setByNetworkPending(stateKey, state, action);
  });
  builder.addCase(thunk.rejected, (state, action) => {
    setByNetworkRejected(stateKey, state, action);
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    setByNetworkFulfilled(stateKey, state, action);
  });
}

function addGlobalAndByNetworkReducers<ActionArgs extends { networkId: NetworkEntity['id'] }>(
  builder: ActionReducerMapBuilder<DataLoaderState>,
  thunk: AsyncThunk<any, ActionArgs, {}>,
  stateKey: keyof DataLoaderState['byNetworkId']['bsc']
) {
  builder.addCase(thunk.pending, (state, action) => {
    if (stateKey in initialDataLoaderState.global) {
      setGlobalPending(stateKey as keyof DataLoaderState['global'], state);
    }
    setByNetworkPending(stateKey, state, action);
  });
  builder.addCase(thunk.rejected, (state, action) => {
    if (stateKey in initialDataLoaderState.global) {
      setGlobalRejected(stateKey as keyof DataLoaderState['global'], state, action);
    }
    setByNetworkRejected(stateKey, state, action);
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    if (stateKey in initialDataLoaderState.global) {
      setGlobalFulfilled(stateKey as keyof DataLoaderState['global'], state);
    }
    setByNetworkFulfilled(stateKey, state, action);
  });
}

export const dataLoaderSlice = createSlice({
  name: 'dataLoader',
  initialState: initialDataLoaderState,
  reducers: {},
  extraReducers: builder => {
    addGlobalReducers(builder, fetchNetworkConfigs, 'networks');
    addGlobalReducers(builder, fetchShrimps, 'shrimps');
    addGlobalAndByNetworkReducers(builder, fetchDrawsForNetworkBefore, 'draws');
    addByNetworkReducers(builder, fetchPrizeTotalsForNetwork, 'prizeTotals');
  },
});

export const dataLoaderReducer = dataLoaderSlice.reducer;
