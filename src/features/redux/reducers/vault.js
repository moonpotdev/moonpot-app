import {
    HOME_FETCH_POOLS_BEGIN,
    HOME_FETCH_POOLS_SUCCESS,
} from "../constants";

const initialState = {
    pools: {},
    totalTvl: 0,
    lastUpdated: 0,
    isPoolsLoading: false,
}

const vaultReducer = (state = initialState, action) => {
    switch(action.type){
        case HOME_FETCH_POOLS_BEGIN:
            return {
                ...state,
                isPoolsLoading: true,
            }
        case HOME_FETCH_POOLS_SUCCESS:
            return {
                ...state,
                pools: action.payload.pools,
                totalTvl: action.payload.totalTvl,
                isPoolsLoading: false,
                lastUpdated: action.payload.lastUpdated,
            }
        default:
            return state
    }
}

export default vaultReducer;
