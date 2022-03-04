import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import { ISession } from './session';
import { IUser } from './user';

export const initialState: ISession = { authenticated: false };

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    create: {
      reducer: (state, action: PayloadAction<ISession>) => action.payload,
      prepare: ({ token, user }: { token: string, user: IUser }) => ({
        payload: {
          authenticated: true,
          token,
          user,
        },
      }),
    },
    destroy: () => initialState,
  },
});
export const {
  actions,
  reducer,
} = sessionSlice;
