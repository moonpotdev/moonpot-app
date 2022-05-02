import {
  BALANCE_FETCH_BALANCES_BEGIN,
  BALANCE_FETCH_BALANCES_DONE,
  BALANCE_RESET,
} from '../constants';
import { potsByNetwork } from '../../../config/vault';
import {
  tokensByNetwork,
  tokensByNetworkAddress,
  tokensByNetworkSymbol,
} from '../../../config/tokens';
import { createReducer } from '@reduxjs/toolkit';
import { networkById, networkIds } from '../../../config/networks';

const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const initialTokens = (() => {
  const initialTokensByNetwork = {};

  for (const networkKey of networkIds) {
    const tokens = {};
    const networkPools = potsByNetwork[networkKey];
    const nativeCurrency = networkById[networkKey].nativeCurrency;
    const nativeTokenSymbol = nativeCurrency.symbol;
    const nativeWrappedTokenSymbol = nativeCurrency.wrappedSymbol;
    const zapAllowances = Object.fromEntries(
      tokensByNetwork[networkKey].filter(token => !!token.zap).map(token => [token.zap, 0])
    );
    const zapAllowancesInfinity = Object.fromEntries(
      tokensByNetwork[networkKey]
        .filter(token => !!token.zap)
        .map(token => [token.zap, MAX_UINT256])
    );

    for (const key in networkPools) {
      const pot = networkPools[key];

      tokens[pot.token] = {
        balance: '0',
        allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
        address: pot.tokenAddress,
      };

      if (pot.hasZapIn || pot.hasZapOut) {
        const pairToken = tokensByNetworkAddress[pot.network][pot.tokenAddress.toLowerCase()];

        if (pairToken.zap) {
          // lp token0 and token1
          for (const symbol of pairToken.lp) {
            const isNative = symbol === nativeWrappedTokenSymbol;
            const token = tokensByNetworkSymbol[pot.network][symbol];

            tokens[token.symbol] = {
              balance: '0',
              allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
              address: token.address,
            };

            if (isNative) {
              tokens[nativeTokenSymbol] = {
                balance: '0',
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
        balance: '0',
        allowance: { ...zapAllowances, [pot.contractAddress]: 0 },
        address: pot.rewardAddress,
      };

      // gate.userTotalBalance TODO: move, its not a token balance
      tokens[pot.contractAddress + ':total'] = {
        balance: '0',
        address: pot.contractAddress,
      };

      // gate.balances TODO: move, its not a token balance
      tokens[pot.contractAddress + ':balance'] = {
        balance: '0',
        address: pot.contractAddress,
      };

      // fairplay time left TODO: move, its not a token balance
      tokens[pot.contractAddress + ':fee'] = {
        timeleft: '0',
        timeleftUpdated: Date.now() / 1000,
        address: pot.contractAddress,
      };
    }

    initialTokensByNetwork[networkKey] = tokens;
  }

  return initialTokensByNetwork;
})();

const initialState = {
  tokensByNetwork: initialTokens,
  lastUpdated: 0,
  isBalancesLoading: false,
  isBalancesFirstTime: true,
};

const balanceReducer = createReducer(initialState, builder => {
  builder
    .addCase(BALANCE_FETCH_BALANCES_BEGIN, (state, action) => {
      state.isBalancesLoading = state.isBalancesFirstTime;
    })
    .addCase(BALANCE_FETCH_BALANCES_DONE, (state, action) => {
      state.tokensByNetwork = action.payload.tokensByNetwork;
      state.lastUpdated = action.payload.lastUpdated;
      state.isBalancesLoading = false;
      state.isBalancesFirstTime = false;
    })
    .addCase(BALANCE_RESET, (state, action) => {
      for (const key in initialState) {
        state[key] = initialState[key];
      }
    });
});

export default balanceReducer;
