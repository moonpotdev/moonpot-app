import {HOME_FETCH_POOLS_BEGIN} from "../constants";

const gateKeeperAbi = require('../../../config/abi/gatekeeper.json');

const getPoolsSingle = async (item, state, dispatch) => {
    console.log('redux getPoolsSingle() processing...');

    return true;
}

const getPoolsAll = async (state, dispatch) => {
    console.log('redux getPoolsAll() processing...');

    return true;
}

const fetchPools = (item = false) => {
    return async (dispatch, getState) => {
        const state = getState();
        dispatch({type: HOME_FETCH_POOLS_BEGIN});
        return item ? await getPoolsSingle(item, state, dispatch) : await getPoolsAll(state, dispatch);
    };
}

const obj = {
    fetchPools,
}

export default obj
