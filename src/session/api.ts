import type { User } from './types';
import { api } from '@store';
import type { ApiSuccess } from '@store/api';

export type Login = {
  password: string;
  username: string;
};

export const sessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation<ApiSuccess<{ token: string, user: User }>, Login>({
      query: (body: Login) => ({
        method: 'POST',
        url: 'session',
        body,
      }),
    }),
  }),
});

export const { useCreateSessionMutation } = sessionApi;
