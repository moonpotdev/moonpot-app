import { UPDATE_FILTER_SORT } from '../constants';

const initialState = {
  sort: '',
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FILTER_SORT:
      return {
        ...state,
        sort: action.payload.sort,
      };
    default:
      return state;
  }
};

export default filterReducer;
