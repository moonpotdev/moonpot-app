import { MultiCall } from 'eth-multicall';
import { BALANCE_FETCH_BALANCES_BEGIN, BALANCE_FETCH_BALANCES_DONE } from '../constants';
import { config } from '../../../config/config';

const erc20Abi = require('../../../config/abi/erc20.json');
const gateManagerAbi = require('../../../config/abi/gatemanager.json');

const getBalances = async (pools, state, dispatch) => {
  const address = state.walletReducer.address;
  const web3 = state.walletReducer.rpc;

  const multicall = [];
  const calls = [];

  for (let key in web3) {
    multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
    calls[key] = [];
  }

  for (let key in pools) {
    const pool = pools[key];

    const tokenContract = new web3[pool.network].eth.Contract(erc20Abi, pool.tokenAddress);
    calls[pool.network].push({
      amount: tokenContract.methods.balanceOf(address),
      token: pool.token,
      address: pool.tokenAddress,
    });

    const gateContract = new web3[pool.network].eth.Contract(gateManagerAbi, pool.contractAddress);
    calls[pool.network].push({
      amount: gateContract.methods.userTotalBalance(address),
      token: pool.contractAddress,
      address: pool.contractAddress,
    });

    calls[pool.network].push({
      allowance: tokenContract.methods.allowance(address, pool.contractAddress),
      token: pool.token,
      spender: pool.contractAddress,
    });

    const ticketContract = new web3[pool.network].eth.Contract(erc20Abi, pool.rewardAddress);
    calls[pool.network].push({
      amount: ticketContract.methods.balanceOf(address),
      address: pool.rewardAddress,
      allowance: ticketContract.methods.allowance(address, pool.contractAddress),
      token: pool.rewardToken,
      spender: pool.contractAddress,
    });
  }

  let response = [];

  for (let key in multicall) {
    const resp = await multicall[key].all([calls[key]]);
    response = [...response, ...resp[0]];
  }

  const tokens = state.balanceReducer.tokens;

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
        [r.spender]: parseInt(r.allowance),
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
  return await getBalances([item], state, dispatch);
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
