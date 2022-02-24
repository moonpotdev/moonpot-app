import {
  UPDATE_FILTER_SORT,
  UPDATE_FILTER_STATUS,
  UPDATE_WINNER_POTS,
  UPDATE_WINNER_SORT,
} from '../constants';

const initialState = {
  sort: '',
  status: '',
  winnerSort: 'featured',
  winnerPots: [],
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FILTER_SORT:
      return {
        ...state,
        sort: action.payload.sort,
      };
    case UPDATE_FILTER_STATUS:
      return {
        ...state,
        status: action.payload.status,
      };
    case UPDATE_WINNER_SORT:
      return {
        ...state,
        winnerSort: action.payload.sort,
      };
    case UPDATE_WINNER_POTS:
      return {
        ...state,
        winnerPots: action.payload.pots,
      };
    default:
      return state;
  }
};

export default filterReducer;
