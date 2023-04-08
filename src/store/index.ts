import type { Middleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import { reducer as session } from '@session';

export {
  useStoreDispatch as useDispatch,
  useStoreSelector as useSelector,
} from './hooks';
export {
  Action,
  ActionCreator,
} from './types';

type getDefaultMiddlewareType = () => Middleware[];

const middleware = (
  getDefaultMiddleware: getDefaultMiddlewareType,
) => getDefaultMiddleware();
export const reducer = { session };
export const store = configureStore({
  middleware,
  reducer,
});

export type Dispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
