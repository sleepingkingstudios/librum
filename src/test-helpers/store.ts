import { Dispatch } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import {
  RootState,
  reducer,
} from '@store';

export type GetState = () => RootState;

export type storeType = ReturnType<typeof configureStore>;

export interface ICreatedStore {
  dispatch: Dispatch;
  getState: GetState;
  store: storeType;
}

export const createStore = (): ICreatedStore => {
  const store = configureStore({ reducer });
  const { dispatch } = store;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const getState = store.getState as GetState;

  return {
    dispatch,
    getState,
    store,
  };
};
