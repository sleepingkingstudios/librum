import { configureStore } from '@reduxjs/toolkit';

import {
  ISession,
  reducer as sessionReducer,
} from '@session';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStoreState {
  session: ISession;
}

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
});
