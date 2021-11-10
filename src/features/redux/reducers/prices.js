import { config } from '../../../config/config';

const initialState = {
  prices: [],
  apy: [],
  ppfs: Object.fromEntries(Object.keys(config).map(network => [network, {}])),
  byNetworkAddress: Object.fromEntries(Object.keys(config).map(network => [network, {}])),
  lastUpdated: 0,
};

const pricesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_PRICES':
      return {
        ...state,
        prices: action.payload.prices,
        apy: action.payload.apy,
        ppfs: action.payload.ppfs,
        byNetworkAddress: action.payload.byNetworkAddress,
        lastUpdated: action.payload.lastUpdated,
      };
    default:
      return state;
  }
};

export default pricesReducer;
