import walletReducer from './wallet';
import vaultReducer from './vault';
import balanceReducer from './balance';
import pricesReducer from './prices';
import earnedReducer from './earned';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  walletReducer,
  vaultReducer,
  balanceReducer,
  pricesReducer,
  earnedReducer,
});

export default rootReducer;
