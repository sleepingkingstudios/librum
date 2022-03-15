import { configureStore } from '@reduxjs/toolkit';

import { reducer as session } from '@session';

export {
  useStoreDispatch as useDispatch,
  useStoreSelector as useSelector,
} from './hooks';

export const reducer = {
  session,
};
export const store = configureStore({
  reducer,
});

export type Dispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
