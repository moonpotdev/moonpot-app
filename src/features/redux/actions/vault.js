import {HOME_FETCH_POOLS_BEGIN, HOME_FETCH_POOLS_SUCCESS} from "../constants";

const getPoolsForNetwork = async (state) => {
    try {
        const p = await import('../../../config/vault');

        if(Object.keys(state.vaultReducer.pools).length === p.pools.length) {
            return state.vaultReducer.pools;
        }
        const pools = p.pools;
        for (let key in pools) {
            pools[key].deposited = 0;
            pools[key].balance = 0;
            pools[key].daily = 0;
            pools[key].apy = 0;
            pools[key].tvl = 0;
        }
        return pools;
    } catch(err) {
        console.log('error reading vaults', err);
    }
}

const fetchPools = () => {
    console.log('redux fetchPools() called.');
    return async (dispatch, getState) => {
        dispatch({type: HOME_FETCH_POOLS_BEGIN});

        const state = getState();
        let pools = await getPoolsForNetwork(state);

        dispatch({
            type: HOME_FETCH_POOLS_SUCCESS,
            payload: {pools: pools, totalTvl: 0, lastUpdated: 0}
        });
    };
}

const obj = {
    fetchPools,
}

export default obj
