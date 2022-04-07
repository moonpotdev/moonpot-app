import { AppState } from '../../../store';
import { DrawEntity } from '../entities/draws';
import { orderBy } from 'lodash';
import { selectAllDrawIds, selectDrawIdsByWinningAddress, selectDrawsByIds } from './draws';
import { selectWalletConnectedAddress } from '../../wallet/selectors';
import { FilteredDrawsState } from '../reducers/filtered-draws';

export const selectFilteredDrawsOptions = (state: AppState) => state.ui.filteredDraws;

export const selectFilteredDrawsMode = (state: AppState) => state.ui.filteredDraws.mode;

export const selectFilteredDrawsNetworks = (state: AppState) => state.ui.filteredDraws.networks;

export const selectFilteredDrawsFilterApplied = (state: AppState) =>
  Object.values(state.ui.filteredDraws.networks).find(selected => selected === false) !== undefined;

export const selectFilteredDraws = (
  state: AppState,
  filter: FilteredDrawsState
): DrawEntity['id'][] => {
  const address = selectWalletConnectedAddress(state);
  const networks = selectFilteredDrawsNetworks(state);

  const ids =
    filter.mode === 'winning'
      ? address
        ? selectDrawIdsByWinningAddress(state, address)
        : []
      : selectAllDrawIds(state);

  const draws = selectDrawsByIds(state, ids).filter(draw => networks[draw.networkId] === true);

  return orderBy<DrawEntity>(draws, ['timestamp'], ['desc']).map(draw => draw.id);
};
