import {
  ActionReducerMapBuilder,
  AsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit';
import { fetchNetworkConfigs } from '../actions/networks';
import { NetworkEntity } from '../entities/network';
import { fetchDrawsForNetworkBefore } from '../actions/draws';

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
  };
  byNetworkId: {
    [networkId: NetworkEntity['id']]: {
      draws: LoaderState;
    };
  };
}

const dataLoaderStateInit: LoaderState = {
  alreadyLoadedOnce: false,
  status: 'init',
  error: null,
};

/*const dataLoaderStateInitByNetworkId: DataLoaderState['byNetworkId']['bsc'] = {
  draws: dataLoaderStateInit,
};*/

export const initialDataLoaderState: DataLoaderState = {
  global: {
    networks: dataLoaderStateInit,
    draws: dataLoaderStateInit,
  },
  byNetworkId: {},
};

function addGlobalReducers(
  builder: ActionReducerMapBuilder<DataLoaderState>,
  thunk: AsyncThunk<any, any, {}>,
  stateKey: keyof DataLoaderState['global']
) {
  builder.addCase(thunk.pending, state => {
    state.global[stateKey].status = 'pending';
    state.global[stateKey].error = null;
  });
  builder.addCase(thunk.rejected, (state, action) => {
    state.global[stateKey].status = 'rejected';
    state.global[stateKey].error = action.error;
  });
  builder.addCase(thunk.fulfilled, state => {
    state.global[stateKey].status = 'fulfilled';
    state.global[stateKey].error = null;
    state.global[stateKey].alreadyLoadedOnce = true;
  });
}

/*function addByNetworkReducers<ActionArgs extends { networkId: NetworkEntity['id'] }>(
  builder: ActionReducerMapBuilder<DataLoaderState>,
  thunk: AsyncThunk<any, ActionArgs, {}>,
  stateKey: keyof DataLoaderState['byNetworkId']['bsc']
) {
  builder.addCase(thunk.pending, (state, action) => {
    const networkId = action.meta.arg.networkId;
    if (state.byNetworkId[networkId] === undefined) {
      state.byNetworkId[networkId] = { ...dataLoaderStateInitByNetworkId };
    }
    state.byNetworkId[networkId][stateKey].status = 'pending';
    state.byNetworkId[networkId][stateKey].error = null;
  });
  builder.addCase(thunk.rejected, (state, action) => {
    const networkId = action.meta.arg.networkId;
    if (state.byNetworkId[networkId] === undefined) {
      state.byNetworkId[networkId] = { ...dataLoaderStateInitByNetworkId };
    }
    state.byNetworkId[networkId][stateKey].status = 'rejected';
    state.byNetworkId[networkId][stateKey].error = action.error;
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    const networkId = action.meta.arg.networkId;
    if (state.byNetworkId[networkId] === undefined) {
      state.byNetworkId[networkId] = { ...dataLoaderStateInitByNetworkId };
    }
    state.byNetworkId[networkId][stateKey].status = 'fulfilled';
    state.byNetworkId[networkId][stateKey].error = null;
    state.byNetworkId[networkId][stateKey].alreadyLoadedOnce = true;
  });
}*/

export const dataLoaderSlice = createSlice({
  name: 'dataLoader',
  initialState: initialDataLoaderState,
  reducers: {},
  extraReducers: builder => {
    addGlobalReducers(builder, fetchNetworkConfigs, 'networks');
    addGlobalReducers(builder, fetchDrawsForNetworkBefore, 'draws');
  },
});

export const dataLoaderReducer = dataLoaderSlice.reducer;
