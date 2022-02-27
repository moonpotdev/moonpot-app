import vaultReducer from './vault';
import balanceReducer from './balance';
import pricesReducer from './prices';
import earnedReducer from './earned';
import zapReducer from './zap';
import buybacksReducer from './buybacks';
import holdersReducer from './holders';
import winnersReducer from '../../winners/redux/reducer';
import promoCodesReducer from '../../promo/reducer';
import { walletReducer } from '../../wallet/slice';
import { filterReducer } from '../../filter/slice';

const reducers = {
  wallet: walletReducer,
  vault: vaultReducer,
  balance: balanceReducer,
  prices: pricesReducer,
  earned: earnedReducer,
  zap: zapReducer,
  buybacks: buybacksReducer,
  holders: holdersReducer,
  winners: winnersReducer,
  filter: filterReducer,
  promo: promoCodesReducer,
};

export default reducers;
