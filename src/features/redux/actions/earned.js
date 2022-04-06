import { MultiCall } from 'eth-multicall';
import { EARNED_FETCH_EARNED_BEGIN, EARNED_FETCH_EARNED_DONE } from '../constants';
import { networkById } from '../../../config/networks';

const gateManagerAbi = require('../../../config/abi/gatemanager.json');

const getEarned = async (pots, state, dispatch) => {
  console.log('redux getEarned() processing...');
  const address = state.wallet.address;
  const web3 = state.wallet.rpc;
  const earned = { ...state.earned.earned };

  const multicall = [];
  const calls = [];

  for (const network in web3) {
    multicall[network] = new MultiCall(web3[network], networkById[network].multicallAddress);
    calls[network] = [];
  }

  for (const pot of Object.values(pots)) {
    if ('bonuses' in pot && pot.bonuses.length) {
      const gateContract = new web3[pot.network].eth.Contract(gateManagerAbi, pot.contractAddress);

      const gateCall = {
        id: pot.id,
      };

      for (const bonus of pot.bonuses) {
        gateCall['earned_' + bonus.id] = gateContract.methods.earned(address, bonus.id);
      }

      calls[pot.network].push(gateCall);
    }
  }

  const results = [];
  for (const network in multicall) {
    const [networkResults] = await multicall[network].all([calls[network]]);
    results.push(...networkResults);
  }

  for (const result of results) {
    const pot = pots[result.id];

    for (const bonus of pot.bonuses) {
      earned[pot.id] = {
        ...earned[pot.id],
        [bonus.id]: result['earned_' + bonus.id],
      };
    }
  }

  dispatch({
    type: EARNED_FETCH_EARNED_DONE,
    payload: {
      earned: earned,
      lastUpdated: new Date().getTime(),
    },
  });

  return true;
};

const getEarnedSingle = async (item, state, dispatch) => {
  console.log('redux getEarnedSingle() processing...');

  // Allow calling by id
  if (typeof item === 'string' && item in state.vault.pools) {
    item = state.vault.pools[item];
  }

  return await getEarned({ [item.id]: item }, state, dispatch);
};

const getEarnedAll = async (state, dispatch) => {
  console.log('redux getEarnedAll() processing...');
  const pools = state.vault.pools;
  return getEarned(pools, state, dispatch);
};

const fetchEarned = (item = false) => {
  return async (dispatch, getState) => {
    const state = getState();
    if (state.wallet.address) {
      dispatch({ type: EARNED_FETCH_EARNED_BEGIN });
      return item
        ? await getEarnedSingle(item, state, dispatch)
        : await getEarnedAll(state, dispatch);
    }
  };
};

const obj = {
  fetchEarned,
};

export default obj;
