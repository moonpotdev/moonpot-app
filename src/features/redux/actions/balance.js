import { MultiCall } from 'eth-multicall';
import { BALANCE_FETCH_BALANCES_BEGIN, BALANCE_FETCH_BALANCES_DONE } from '../constants';
import { config } from '../../../config/config';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';

const erc20Abi = require('../../../config/abi/erc20.json');
const gateManagerAbi = require('../../../config/abi/gatemanager.json');

const getBalances = async (pools, state, dispatch) => {
  const address = state.walletReducer.address;
  const web3 = state.walletReducer.rpc;

  const multicall = [];
  const calls = [];
  const needsNativeBalance = {};

  for (const key in web3) {
    multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
    calls[key] = [];
    needsNativeBalance[key] = false;
  }

  for (const key in pools) {
    const pot = pools[key];

    const tokenContract = new web3[pot.network].eth.Contract(erc20Abi, pot.tokenAddress);
    calls[pot.network].push({
      amount: tokenContract.methods.balanceOf(address),
      token: pot.token,
      address: pot.tokenAddress,
    });

    // lp
    if (pot.vaultType === 'lp') {
      const nativeWrappedTokenSymbol = config[pot.network].nativeCurrency.wrappedSymbol;
      const pairToken = tokensByNetworkAddress[pot.network][pot.tokenAddress.toLowerCase()];

      if (pairToken.zap) {
        // Allowance of zap to spend tickets
        const ticketContract = new web3[pot.network].eth.Contract(erc20Abi, pot.rewardAddress);
        calls[pot.network].push({
          allowance: ticketContract.methods.allowance(address, pairToken.zap),
          token: pot.rewardToken,
          spender: pairToken.zap,
        });

        // Allowance of zap to spend lp
        const lpContract = new web3[pot.network].eth.Contract(erc20Abi, pot.tokenAddress);
        calls[pot.network].push({
          allowance: lpContract.methods.allowance(address, pairToken.zap),
          token: pot.token,
          spender: pairToken.zap,
        });

        // token0/token1
        for (const symbol of pairToken.lp) {
          const isNative = symbol === nativeWrappedTokenSymbol;
          const token = tokensByNetworkSymbol[pot.network][symbol];
          const tokenContract = new web3[pot.network].eth.Contract(erc20Abi, token.address);

          // Balance of token0/token1
          calls[pot.network].push({
            amount: tokenContract.methods.balanceOf(address),
            token: token.symbol,
            address: token.address,
          });

          // Allowance of zap to spend token0/token1
          calls[pot.network].push({
            allowance: tokenContract.methods.allowance(address, pairToken.zap),
            token: token.symbol,
            spender: pairToken.zap,
          });

          // Do we need native balance
          if (isNative) {
            needsNativeBalance[pot.network] = true;
          }
        }
      }
    }

    const gateContract = new web3[pot.network].eth.Contract(gateManagerAbi, pot.contractAddress);
    calls[pot.network].push({
      amount: gateContract.methods.userTotalBalance(address),
      token: pot.contractAddress,
      address: pot.contractAddress,
    });

    calls[pot.network].push({
      allowance: tokenContract.methods.allowance(address, pot.contractAddress),
      token: pot.token,
      spender: pot.contractAddress,
    });

    const ticketContract = new web3[pot.network].eth.Contract(erc20Abi, pot.rewardAddress);
    calls[pot.network].push({
      amount: ticketContract.methods.balanceOf(address),
      address: pot.rewardAddress,
      allowance: ticketContract.methods.allowance(address, pot.contractAddress),
      token: pot.rewardToken,
      spender: pot.contractAddress,
    });
  }

  let response = [];

  for (let key in multicall) {
    const resp = await multicall[key].all([calls[key]]);
    response = [...response, ...resp[0]];
  }

  const tokens = { ...state.balanceReducer.tokens };

  for (const network in needsNativeBalance) {
    if (needsNativeBalance[network]) {
      const balance = await web3[network].eth.getBalance(address);
      const symbol = config[network].nativeCurrency.symbol;
      tokens[symbol] = {
        ...tokens[symbol],
        balance: balance,
      };
    }
  }

  for (let index in response) {
    const r = response[index];
    if (r.amount !== undefined) {
      tokens[r.token] = {
        ...tokens[r.token],
        balance: r.amount,
        address: r.address,
      };
    }
    if (r.allowance !== undefined) {
      tokens[r.token].allowance = {
        ...tokens[r.token].allowance,
        [r.spender]: r.allowance,
      };
    }
  }

  dispatch({
    type: BALANCE_FETCH_BALANCES_DONE,
    payload: {
      tokens: tokens,
      lastUpdated: new Date().getTime(),
    },
  });

  return true;
};

const getBalancesSingle = async (item, state, dispatch) => {
  console.log('redux getBalancesSingle() processing...');
  return await getBalances({ [item.id]: item }, state, dispatch);
};

const getBalancesAll = async (state, dispatch) => {
  console.log('redux getBalancesAll() processing...');
  const pools = state.vaultReducer.pools;
  return await getBalances(pools, state, dispatch);
};

const fetchBalances = (item = false) => {
  return async (dispatch, getState) => {
    const state = getState();
    if (state.walletReducer.address) {
      dispatch({ type: BALANCE_FETCH_BALANCES_BEGIN });
      return item
        ? await getBalancesSingle(item, state, dispatch)
        : await getBalancesAll(state, dispatch);
    }
  };
};

const obj = {
  fetchBalances,
};

export default obj;
