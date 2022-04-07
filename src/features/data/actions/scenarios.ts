import { AppThunk } from '../../../store';
import { fetchNetworkConfigs } from './networks';
import { selectNetworkIds } from '../selectors/networks';
import { fetchDrawsForNetworkBefore, fetchUniqueWinners } from './draws';

export function initialGlobalLoader(): AppThunk {
  return async (dispatch, getState) => {
    const networksLoading = dispatch(fetchNetworkConfigs());

    await networksLoading;

    dispatch(fetchUniqueWinners());
  };
}

export function initialUserLoader(address: string): AppThunk {
  return async (dispatch, getState) => {
    return null;
  };
}

export function initialDrawsLoader(): AppThunk {
  return async (dispatch, getState) => {
    const state = getState();
    const networkIds = selectNetworkIds(state);
    const now = Math.floor(Date.now() / 1000);

    for (const id of networkIds) {
      dispatch(
        fetchDrawsForNetworkBefore({
          networkId: id,
          timestamp: now,
        })
      );
    }
  };
}
