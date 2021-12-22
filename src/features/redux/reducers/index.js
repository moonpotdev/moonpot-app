import walletReducer from './wallet';
import vaultReducer from './vault';
import balanceReducer from './balance';
import pricesReducer from './prices';
import earnedReducer from './earned';
import modalReducer from './modal';
import zapReducer from './zap';
import buybacksReducer from './buybacks';
import holdersReducer from './holders';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  walletReducer,
  vaultReducer,
  balanceReducer,
  pricesReducer,
  earnedReducer,
  modalReducer,
  zapReducer,
  buybacksReducer,
  holdersReducer,
});

export default rootReducer;
