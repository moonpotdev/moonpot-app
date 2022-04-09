import { AppState } from '../../../store';
import { DrawEntity } from '../entities/draws';
import { orderBy } from 'lodash';
import { selectAllDrawIds, selectDrawIdsByWinningAddress, selectDrawsByIds } from './draws';
import { selectWalletConnectedAddress } from '../../wallet/selectors';
import { FilteredDrawsState } from '../reducers/filtered-draws';
import { selectPotById } from './pots';

export const selectFilteredDrawsOptions = (state: AppState) => state.ui.filteredDraws;

export const selectFilteredDrawsMode = (state: AppState) => state.ui.filteredDraws.mode;

export const selectFilteredDrawsNetworks = (state: AppState) => state.ui.filteredDraws.networks;

export const selectFilteredDrawsPots = (state: AppState) => state.ui.filteredDraws.pots;

export const selectFilteredDrawsFilterApplied = (state: AppState) =>
  Object.values(state.ui.filteredDraws.networks).find(selected => selected === false) !== undefined;

export const selectFilteredDraws = (
  state: AppState,
  filter: FilteredDrawsState
): DrawEntity['id'][] => {
  const address = selectWalletConnectedAddress(state);
  const networks = filter.networks;
  const pots = filter.pots;

  const ids =
    filter.mode === 'winning'
      ? address
        ? selectDrawIdsByWinningAddress(state, address)
        : []
      : selectAllDrawIds(state);

  let draws = selectDrawsByIds(state, ids);

  // filter by network
  draws = draws.filter(draw => networks[draw.networkId] === true);

  // filter by pot name
  if (pots.length > 0) {
    draws = draws.filter(draw => pots.includes(selectPotById(state, draw.potId).name));
  }

  return orderBy<DrawEntity>(draws, ['timestamp'], ['desc']).map(draw => draw.id);
};
