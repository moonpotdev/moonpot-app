import { MultiCall } from 'eth-multicall';
import { BALANCE_FETCH_BALANCES_BEGIN, BALANCE_FETCH_BALANCES_DONE } from '../constants';
import { config } from '../../../config/config';
import { tokensByNetworkAddress, tokensByNetworkSymbol } from '../../../config/tokens';
import prizePoolAbi from '../../../config/abi/prizepool.json';
import erc20Abi from '../../../config/abi/erc20.json';
import gateManagerAbi from '../../../config/abi/gatemanager.json';

const getBalances = async (pools, state, dispatch) => {
  const address = state.walletReducer.address;
  const web3 = state.walletReducer.rpc;

  const multicall = [];
  const calls = [];
  const needsNativeBalance = {};

  for (const network in web3) {
    multicall[network] = new MultiCall(web3[network], config[network].multicallAddress);
    calls[network] = [];
    needsNativeBalance[network] = false;
  }

  for (const id in pools) {
    const pot = pools[id];
    const network = pot.network;
    const ticketContract = new web3[network].eth.Contract(erc20Abi, pot.rewardAddress);
    const tokenContract = new web3[network].eth.Contract(erc20Abi, pot.tokenAddress);
    const gateContract = new web3[network].eth.Contract(gateManagerAbi, pot.contractAddress);
    const prizePoolContract = new web3[network].eth.Contract(prizePoolAbi, pot.prizePoolAddress);

    // wallet balance of pot deposit token
    calls[network].push({
      amount: tokenContract.methods.balanceOf(address),
      token: pot.token,
      address: pot.tokenAddress,
    });

    // allowance of pot to spend deposit token
    calls[network].push({
      allowance: tokenContract.methods.allowance(address, pot.contractAddress),
      token: pot.token,
      spender: pot.contractAddress,
    });

    // deposited total balance (tickets + balance)
    calls[network].push({
      amount: gateContract.methods.userTotalBalance(address),
      token: pot.contractAddress + ':total',
      address: pot.contractAddress,
    });

    // deposited balance (interest earning)
    calls[network].push({
      amount: gateContract.methods.balances(address),
      token: pot.contractAddress + ':balance',
      address: pot.contractAddress,
    });

    // user balance of tickets + allowance of pot to spend tickets
    calls[network].push({
      amount: ticketContract.methods.balanceOf(address),
      address: pot.rewardAddress,
      allowance: ticketContract.methods.allowance(address, pot.contractAddress),
      token: pot.rewardToken,
      spender: pot.contractAddress,
    });

    // fairplay time left
    calls[network].push({
      timeleft: prizePoolContract.methods.userFairPlayLockRemaining(address, pot.rewardAddress),
      token: pot.contractAddress + ':fee',
      address: pot.contractAddress,
    });

    // allowance of pot to spend mooToken
    if ('mooTokenAddress' in pot && pot.mooTokenAddress) {
      const mooTokenContract = new web3[network].eth.Contract(erc20Abi, pot.mooTokenAddress);
      calls[network].push({
        allowance: mooTokenContract.methods.allowance(address, pot.contractAddress),
        token: pot.mooTokenAddress,
        spender: pot.contractAddress,
      });
    }

    // lp
    if (pot.vaultType === 'lp' || pot.vaultType === 'stable') {
      const pairToken = tokensByNetworkAddress[network][pot.tokenAddress.toLowerCase()];

      if (pairToken.zap) {
        const nativeWrappedTokenSymbol = config[network].nativeCurrency.wrappedSymbol;

        // Allowance of zap to spend tickets
        calls[network].push({
          allowance: ticketContract.methods.allowance(address, pairToken.zap),
          token: pot.rewardToken,
          spender: pairToken.zap,
        });

        // Allowance of zap to spend lp
        const lpContract = new web3[network].eth.Contract(erc20Abi, pot.tokenAddress);
        calls[network].push({
          allowance: lpContract.methods.allowance(address, pairToken.zap),
          token: pot.token,
          spender: pairToken.zap,
        });

        // token0/token1 of lp
        for (const symbol of pairToken.lp) {
          const isNative = symbol === nativeWrappedTokenSymbol;
          const token = tokensByNetworkSymbol[network][symbol];
          const tokenContract = new web3[network].eth.Contract(erc20Abi, token.address);

          // Balance of token0/token1
          calls[network].push({
            amount: tokenContract.methods.balanceOf(address),
            token: token.symbol,
            address: token.address,
          });

          // Allowance of zap to spend token0/token1
          calls[network].push({
            allowance: tokenContract.methods.allowance(address, pairToken.zap),
            token: token.symbol,
            spender: pairToken.zap,
          });

          // Do we need native balance
          if (isNative) {
            needsNativeBalance[network] = true;
          }
        }
      }
    }
  }

  // Merge responses per network
  let responses = [];
  for (const network in multicall) {
    const [response] = await multicall[network].all([calls[network]]);
    responses = [...responses, ...response];
  }

  // New array for new state
  const tokens = { ...state.balanceReducer.tokens };

  // Native balances
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

  // Build new state
  for (const response of responses) {
    if (response.amount !== undefined) {
      tokens[response.token] = {
        ...tokens[response.token],
        balance: response.amount,
        address: response.address,
      };
    }

    if (response.allowance !== undefined) {
      tokens[response.token] = {
        ...tokens[response.token],
        allowance: {
          ...(tokens[response.token]?.allowance || {}),
          [response.spender]: response.allowance,
        },
      };
    }

    if (response.timeleft !== undefined) {
      tokens[response.token] = {
        ...tokens[response.token],
        timeleft: parseInt(response.timeleft || 0),
        timeleftUpdated: Date.now() / 1000,
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
