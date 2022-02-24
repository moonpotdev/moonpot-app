import {
  UPDATE_FILTER_SORT,
  UPDATE_FILTER_STATUS,
  UPDATE_WINNER_POTS,
  UPDATE_WINNER_SORT,
} from '../constants';

const updateFilterSort = sort => ({
  type: UPDATE_FILTER_SORT,
  payload: {
    sort: sort,
  },
});

const updateFilterStatus = status => ({
  type: UPDATE_FILTER_STATUS,
  payload: {
    status: status,
  },
});

const updateWinnerPots = pots => ({
  type: UPDATE_WINNER_POTS,
  payload: {
    pots: pots,
  },
});

const updateWinnerSort = sort => ({
  type: UPDATE_WINNER_SORT,
  payload: {
    sort: sort,
  },
});

const obj = {
  updateFilterSort,
  updateFilterStatus,
  updateWinnerPots,
  updateWinnerSort,
};

export default obj;
