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
    const nativeWrappedTokenSymbol = nativeCurrency.wrappedSymbol;
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

      if (pot.vaultType === 'lp' || pot.vaultType === 'stable') {
        const pairToken = tokensByNetworkAddress[pot.network][pot.tokenAddress.toLowerCase()];

        if (pairToken.zap) {
          // lp token0 and token1
          for (const symbol of pairToken.lp) {
            const isNative = symbol === nativeWrappedTokenSymbol;
            const token = tokensByNetworkSymbol[pot.network][symbol];

            tokens[token.symbol] = {
              balance: 0,
              allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
              address: token.address,
            };

            if (isNative) {
              tokens[nativeTokenSymbol] = {
                balance: 0,
                allowance: { ...zapAllowancesInfinity, [pot.contractAddress]: MAX_UINT256 },
                address: false,
                isNative: true,
              };
            }
          }
        }
      }

      // ticket
      tokens[pot.rewardToken] = {
        balance: 0,
        allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
        address: pot.rewardAddress,
      };

      // gate.userTotalBalance TODO: move, its not a token balance
      tokens[pot.contractAddress + ':total'] = {
        balance: 0,
        address: pot.contractAddress,
      };

      // gate.balances TODO: move, its not a token balance
      tokens[pot.contractAddress + ':balance'] = {
        balance: 0,
        address: pot.contractAddress,
      };

      // fairplay time left TODO: move, its not a token balance
      tokens[pot.contractAddress + ':fee'] = {
        timeleft: 0,
        timeleftUpdated: Date.now() / 1000,
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
