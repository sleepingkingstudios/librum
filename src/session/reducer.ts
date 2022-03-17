import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

import type {
  Session,
  User,
} from './types';

export const initialState: Session = { authenticated: false };

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    create: {
      reducer: (state, action: PayloadAction<Session>) => action.payload,
      prepare: ({ token, user }: { token: string, user: User }) => ({
        payload: {
          authenticated: true,
          token,
          user,
        },
      }),
    },
    destroy: () => ({ authenticated: false }),
  },
});
export const {
  actions,
  reducer,
} = sessionSlice;
export const selector =
  (state: { session: Session }): Session => state.session;
