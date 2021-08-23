import { BALANCE_FETCH_BALANCES_BEGIN, BALANCE_FETCH_BALANCES_DONE } from '../constants';
import { config } from '../../../config/config';
import { potsByNetwork } from '../../../config/vault';

const initialTokens = () => {
  const tokens = [];
  for (let net in config) {
    const networkPools = potsByNetwork[net];
    for (const key in networkPools) {
      tokens[networkPools[key].token] = {
        balance: 0,
        allowance: { [networkPools[key].contractAddress]: 0 },
        address: networkPools[key].tokenAddress,
      };

      tokens[networkPools[key].rewardToken] = {
        balance: 0,
        allowance: { [networkPools[key].contractAddress]: 0 },
        address: networkPools[key].rewardAddress,
      };
    }
  }

  return tokens;
};

const initialState = {
  tokens: initialTokens(),
  lastUpdated: 0,
  isBalancesLoading: false,
  isBalancesFirstTime: true,
};

const balanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case BALANCE_FETCH_BALANCES_BEGIN:
      return {
        ...state,
        isBalancesLoading: state.isBalancesFirstTime,
      };
    case BALANCE_FETCH_BALANCES_DONE:
      return {
        ...state,
        tokens: action.payload.tokens,
        lastUpdated: action.payload.lastUpdated,
        isBalancesLoading: false,
        isBalancesFirstTime: false,
      };
    default:
      return state;
  }
};

export default balanceReducer;
