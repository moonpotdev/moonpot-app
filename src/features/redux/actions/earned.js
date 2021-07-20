import {MultiCall} from 'eth-multicall';
import {EARNED_FETCH_EARNED_BEGIN, EARNED_FETCH_EARNED_DONE} from "../constants";
import {config} from '../../../config/config';

const gateManagerAbi = require('../../../config/abi/gatemanager.json');

const getEarnedSingle = async (item, state, dispatch) => {
    console.log('redux getEarnedSingle() processing...');
    const address = state.walletReducer.address;
    const web3 = state.walletReducer.rpc;

    const gateContract = new web3[item.network].eth.Contract(gateManagerAbi, item.contractAddress);
    const earnedAmount = await gateContract.methods.earned(address).call();

    const earned = state.earnedReducer.earned;
    earned[item.id] = {
        [item.sponsorToken]: earnedAmount,
    };

    dispatch({
        type: EARNED_FETCH_EARNED_DONE,
        payload: {
            earned: earned,
            lastUpdated: new Date().getTime()
        }
    });

    return true;
}

const getEarnedAll = async (state, dispatch) => {
    console.log('redux getEarnedAll() processing...');
    const address = state.walletReducer.address;
    const web3 = state.walletReducer.rpc;
    const pools = state.vaultReducer.pools;

    const multicall = [];
    const calls = [];

    for (let key in web3) {
        multicall[key] = new MultiCall(web3[key], config[key].multicallAddress);
        calls[key] = [];
    }

    for (let key in pools) {
        const gateContract = new web3[pools[key].network].eth.Contract(gateManagerAbi, pools[key].contractAddress);

        calls[pools[key].network].push({
            amount: gateContract.methods.earned(address),
            token: pools[key].sponsorToken,
            address: pools[key].rewardAddress,
        });
    }

    let response = [];

    for (let key in multicall) {
        const resp = await multicall[key].all([calls[key]]);
        response = [...response, ...resp[0]];
    }

    const earned = state.earnedReducer.earned;
    const ids = Object.keys(pools);
    for (let index in response) {
        const pool = pools[ids[index]];
        earned[pool.id] = {
            [pool.sponsorToken]: response[index].amount,
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
