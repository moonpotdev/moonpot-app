import walletReducer from './wallet'
import vaultReducer from './vault'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    walletReducer,
    vaultReducer,
})

export default rootReducer
