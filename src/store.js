import { configureStore } from '@reduxjs/toolkit';
import { eventsMiddleware } from './features/redux/middleware/events';
import reducers from './features/redux/reducers';

export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: {
        ignoredPaths: ['wallet.web3', 'wallet.provider', 'wallet.rpc'],
      },
    }).concat(eventsMiddleware),
});
