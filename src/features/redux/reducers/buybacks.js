import { FETCH_BUYBACKS_BEGIN, FETCH_BUYBACKS_SUCCESS, FETCH_BUYBACKS_FAILURE } from '../constants';

const initialState = {
  lastWeekBuyback: 0,
  lastMonthBuyback: 0,
  allTimeBuyback: 0,
  loading: false,
  error: null,
};

const buybacksReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BUYBACKS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_BUYBACKS_SUCCESS:
      return {
        ...state,
        loading: false,
        lastWeekBuyback: action.payload.lastWeekBuyback,
        lastMonthBuyback: action.payload.lastMonthBuyback,
        allTimeBuyback: action.payload.allTimeBuyback,
      };
    case FETCH_BUYBACKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default buybacksReducer;
