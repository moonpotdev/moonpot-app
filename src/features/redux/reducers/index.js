import walletReducer from './wallet'
import vaultReducer from './vault'
import balanceReducer from './balance'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    walletReducer,
    vaultReducer,
    balanceReducer,
})

export default rootReducer
