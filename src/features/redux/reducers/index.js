import walletReducer from './wallet';
import vaultReducer from './vault';
import balanceReducer from './balance';
import pricesReducer from './prices';
import earnedReducer from './earned';
import modalReducer from './modal';
import zapReducer from './zap';
import buybacksReducer from './buybacks';
import holdersReducer from './holders';
import winnersReducer from '../../winners/redux/reducer';
import filterReducer from './filter';
import promoCodesReducer from '../../promo/reducer';

const reducers = {
  walletReducer,
  vaultReducer,
  balanceReducer,
  pricesReducer,
  earnedReducer,
  modalReducer,
  zapReducer,
  buybacksReducer,
  holders: holdersReducer,
  winners: winnersReducer,
  filterReducer,
  promo: promoCodesReducer,
};

export default reducers;
