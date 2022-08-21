import type { User } from './types';
import { api } from '@api';
import type { ApiSuccess } from '@api';

export type Login = {
  password: string;
  username: string;
};

export const sessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation<ApiSuccess<{ token: string, user: User }>, Login>({
      query: (body: Login) => ({
        method: 'POST',
        url: 'authentication/session',
        body,
      }),
    }),
  }),
});

export const { useCreateSessionMutation } = sessionApi;
