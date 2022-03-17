import type { Middleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { api } from './api';
import { reducer as session } from '@session';

export { api } from './api';
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
) => getDefaultMiddleware().concat(api.middleware);
export const reducer = {
  api: api.reducer,
  session,
};
export const store = configureStore({
  middleware,
  reducer,
});

setupListeners(store.dispatch);

export type Dispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
