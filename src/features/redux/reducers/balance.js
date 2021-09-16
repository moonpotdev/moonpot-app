import {
  BALANCE_FETCH_BALANCES_BEGIN,
  BALANCE_FETCH_BALANCES_DONE,
  BALANCE_RESET,
} from '../constants';
import { config } from '../../../config/config';
import { potsByNetwork } from '../../../config/vault';
import {
  tokensByNetwork,
  tokensByNetworkAddress,
  tokensByNetworkSymbol,
} from '../../../config/tokens';

const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const initialTokens = (() => {
  const tokens = [];
  for (const net in config) {
    const networkPools = potsByNetwork[net];
    const nativeCurrency = config[net].nativeCurrency;
    const nativeTokenSymbol = nativeCurrency.symbol;
    const zapAllowances = Object.fromEntries(
      tokensByNetwork[net]
        .filter(token => token.type === 'lp' && token.zap)
        .map(token => [token.zap, 0])
    );
    const zapAllowancesInfinity = Object.fromEntries(
      tokensByNetwork[net]
        .filter(token => token.type === 'lp' && token.zap)
        .map(token => [token.zap, MAX_UINT256])
    );

    for (const key in networkPools) {
      const pot = networkPools[key];

      tokens[pot.token] = {
        balance: 0,
        allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
        address: pot.tokenAddress,
      };

      if (pot.vaultType === 'lp') {
        const pairToken = tokensByNetworkAddress[pot.network][pot.tokenAddress.toLowerCase()];

        if (pairToken.zap) {
          for (const symbol of pairToken.lp) {
            const isNative = symbol === nativeTokenSymbol;
            const wrappedSymbol = isNative ? nativeCurrency.wrappedSymbol : symbol;
            const token = tokensByNetworkSymbol[pot.network][wrappedSymbol];

            tokens[token.symbol] = {
              balance: 0,
              allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
              address: token.address,
            };

            if (isNative) {
              tokens[nativeTokenSymbol] = {
                balance: 0,
                allowance: { ...zapAllowancesInfinity, [pot.contractAddress]: Infinity },
                address: false,
                isNative: true,
              };
            }
          }
        }
      }

      tokens[pot.rewardToken] = {
        balance: 0,
        allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
        address: pot.rewardAddress,
      };

      tokens[pot.contractAddress] = {
        balance: 0,
        address: pot.contractAddress,
      };
    }
  }

  return tokens;
})();

const initialState = {
  tokens: initialTokens,
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
    case BALANCE_RESET:
      return { ...initialState };
    default:
      return state;
  }
};

export default balanceReducer;
