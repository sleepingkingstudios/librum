import { Dispatch } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import {
  IStoreState,
  reducer,
} from '@store';

export type getStateType = () => IStoreState;

export type storeType = ReturnType<typeof configureStore>;

export interface ICreatedStore {
  dispatch: Dispatch;
  getState: getStateType;
  store: storeType;
}

export const createStore = (): ICreatedStore => {
  const store = configureStore({ reducer });
  const { dispatch } = store;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const getState = store.getState as getStateType;

  return {
    dispatch,
    getState,
    store,
  };
};
