import { UPDATE_FILTER_SORT, UPDATE_FILTER_STATUS } from '../constants';

const initialState = {
  sort: '',
  status: '',
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
    default:
      return state;
  }
};

export default filterReducer;
