import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { eventsMiddleware } from './features/redux/middleware/events';
import reducers from './features/redux/reducers';
/*import {
  combineListeners,
  createActionListenerMiddleware,
} from './features/data/middlewares/action-events';*/
// import { winnersListeners } from './features/data/reducers/winners';

// const listeners = createActionListenerMiddleware<AppState>(combineListeners([winnersListeners]));

export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(eventsMiddleware),
  /*.concat(listeners)*/
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof reducers>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
