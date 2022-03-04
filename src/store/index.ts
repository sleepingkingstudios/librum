import { configureStore } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStoreState {}

export const store = configureStore({ reducer: {} });
