import {
    HOME_FETCH_POOLS_BEGIN,
    HOME_FETCH_POOLS_DONE,
} from "../constants";
import {config} from "../../../config/config";
import BigNumber from "bignumber.js";

const initialPools = () => {
    const pools = [];

    for(let net in config) {
        const data = require('../../../config/vault/' + net + '.js');
        for (const key in data.pools) {
            const pool = data.pools[key];

            pool['network'] = net;
            pool['daily'] = 0;
            pool['apy'] = 0;
            pool['tvl'] = 0;
            pool['awardBalance'] = new BigNumber(0);

            pools[pool.id] = pool;
        }
    }

    return pools;

}

const initialState = {
    pools: initialPools(),
    totalTvl: 0,
    lastUpdated: 0,
    isPoolsLoading: false,
    isFirstTime: true,
}

const vaultReducer = (state = initialState, action) => {
    switch(action.type){
        case HOME_FETCH_POOLS_BEGIN:
            return {
                ...state,
                isPoolsLoading: state.isFirstTime,
            }
        case HOME_FETCH_POOLS_DONE:
            return {
                ...state,
                pools: action.payload.pools,
                totalTvl: action.payload.totalTvl,
                lastUpdated: action.payload.lastUpdated,
                isPoolsLoading: action.payload.isPoolsLoading,
                isFirstTime: false,
            }
        default:
            return state
    }
}

export default vaultReducer;
