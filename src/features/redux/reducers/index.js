import { combineReducers } from 'redux';
import vaultReducer from './vault';
import balanceReducer from './balance';
import pricesReducer from './prices';
import earnedReducer from './earned';
import zapReducer from './zap';
import buybacksReducer from './buybacks';
import holdersReducer from './holders';
import promoCodesReducer from '../../promo/reducer';
import { walletReducer } from '../../wallet/slice';
import { filterReducer } from '../../filter/slice';
import { dataLoaderReducer } from '../../data/reducers/data-loader';
import { networksReducer } from '../../data/reducers/networks';
import { drawsReducer } from '../../data/reducers/draws';
import { filteredDrawsReducer } from '../../data/reducers/filtered-draws';
import { shrimpsReducer } from '../../data/reducers/shrimps';

const reducers = combineReducers({
  ui: combineReducers({
    dataLoader: dataLoaderReducer,
    filteredDraws: filteredDrawsReducer,
  }),
  entities: combineReducers({
    networks: networksReducer,
    draws: drawsReducer,
    shrimps: shrimpsReducer,
  }),
  wallet: walletReducer,
  vault: vaultReducer,
  balance: balanceReducer,
  prices: pricesReducer,
  earned: earnedReducer,
  zap: zapReducer,
  buybacks: buybacksReducer,
  holders: holdersReducer,
  filter: filterReducer,
  promo: promoCodesReducer,
});

export default reducers;
