import { ZAP_SWAP_ESTIMATE_COMPLETE, ZAP_SWAP_ESTIMATE_PENDING } from '../constants';

const initialState = {};

const zapReducer = (state = initialState, action) => {
  const payload = action.payload;

  switch (action.type) {
    case ZAP_SWAP_ESTIMATE_PENDING:
      console.log(action);
      return {
        ...state,
        [payload.requestId]: {
          ...(state[payload.requestId] || {}),
          ...action.payload,
          pending: true,
        },
      };
    case ZAP_SWAP_ESTIMATE_COMPLETE:
      console.log(action);
      return {
        ...state,
        [payload.requestId]: {
          ...(state[payload.requestId] || {}),
          ...action.payload,
          pending: false,
        },
      };
    default:
      return state;
  }
};

export default zapReducer;
