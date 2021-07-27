import {MultiCall} from 'eth-multicall';
import {EARNED_FETCH_EARNED_BEGIN, EARNED_FETCH_EARNED_DONE} from "../constants";
import {config} from '../../../config/config';

const gateManagerAbi = require('../../../config/abi/gatemanager.json');

const getEarned = async (pools, state, dispatch) => {
    console.log('redux getEarnedAll() processing...');
    const address = state.walletReducer.address;
    const web3 = state.walletReducer.rpc;

    const multicall = [];
    const calls = [];

    for (let key in web3) {
        multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
        calls[key] = [];
    }

    for (let key in pools) {
        const gateContract = new web3[pools[key].network].eth.Contract(gateManagerAbi, pools[key].contractAddress);
        const pool = pools[key]

        if (pool.sponsorRewardId !== undefined) {
            calls[pool.network].push({
                amount: gateContract.methods.earned(address, pool.sponsorRewardId),
                token: pool.sponsorToken,
                address: pool.rewardAddress,
                poolId: pool.id
            });
        } else {
            calls[pool.network].push({
                amount: gateContract.methods.earned(address),
                token: pool.sponsorToken,
                address: pool.rewardAddress,
                poolId: pool.id
            });
        }

        if (pool.boostToken && pool.boostRewardId !== undefined) {
            calls[pool.network].push({
                amount: gateContract.methods.earned(address, pool.boostRewardId),
                token: pool.boostToken,
                address: pool.rewardAddress,
                poolId: pool.id
            });
        }
    }

    let response = [];

    for (let key in multicall) {
        const resp = await multicall[key].all([calls[key]]);
        response = [...response, ...resp[0]];
    }

    const earned = state.earnedReducer.earned;
    for (let index in response) {
        const r = response[index];
        earned[r.poolId] = {
            ...earned[r.poolId],
            [r.token]: r.amount,
        };
    }

    dispatch({
        type: EARNED_FETCH_EARNED_DONE,
        payload: {
            earned: earned,
            lastUpdated: new Date().getTime()
        }
    });

    return true;
}

const getEarnedSingle = async (item, state, dispatch) => {
    console.log('redux getEarnedSingle() processing...');
    return await getEarned([item], state, dispatch)
}

const getEarnedAll = async (state, dispatch) => {
    console.log('redux getEarnedAll() processing...');
    const pools = state.vaultReducer.pools;
    return getEarned(pools, state, dispatch);
}

const fetchEarned = (item = false) => {
    return async (dispatch, getState) => {
        const state = getState();
        if (state.walletReducer.address) {
            dispatch({type: EARNED_FETCH_EARNED_BEGIN});
            return item ? await getEarnedSingle(item, state, dispatch) : await getEarnedAll(state, dispatch);
        }
    };
}

const obj = {
    fetchEarned,
}

export default obj
