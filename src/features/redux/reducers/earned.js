import {
    EARNED_FETCH_EARNED_BEGIN,
    EARNED_FETCH_EARNED_DONE,
} from "../constants";
import {config} from "../../../config/config";

const initialEarned = () => {
    const earned = [];
    for (let net in config) {
        const data = require('../../../config/vault/' + net + '.js');
        for (const key in data.pools) {
            earned[data.pools[key].id] = {
                [data.pools[key].sponsorToken]: 0,
            }
        }
    }

    return earned;
}

const initialState = {
    earned: initialEarned(),
    lastUpdated: 0,
    isEarnedLoading: false,
    isEarnedFirstTime: true,
}

const earnedReducer = (state = initialState, action) => {
    switch (action.type) {
        case EARNED_FETCH_EARNED_BEGIN:
            return {
                ...state,
                isBalancesLoading: state.isEarnedFirstTime,
            }
        case EARNED_FETCH_EARNED_DONE:
            return {
                ...state,
                earned: action.payload.earned,
                lastUpdated: action.payload.lastUpdated,
                isEarnedLoading: false,
                isEarnedFirstTime: false,
            }
        default:
            return state
    }
}

export default earnedReducer;
