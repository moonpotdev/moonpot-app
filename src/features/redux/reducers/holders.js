import { FETCH_HOLDERS_BEGIN, FETCH_HOLDERS_SUCCESS, FETCH_HOLDERS_FAILURE } from '../constants';

const initialState = {
  holders: [],
  totalHolders: [],
  loading: false,
  error: null,
};

const holdersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HOLDERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_HOLDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        holders: action.payload.holders,
        totalHolders: action.payload.totalHolders,
      };
    case FETCH_HOLDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default holdersReducer;
