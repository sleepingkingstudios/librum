import { configureStore } from '@reduxjs/toolkit';

import { reducer as session } from '@session';

export { IStoreState } from './state';

export const reducer = {
  session,
};
export const store = configureStore({
  reducer,
});
