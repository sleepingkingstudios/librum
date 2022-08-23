import { api } from '@api';
import type { ApiSuccess } from '@api';
import type { User } from '@session';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<ApiSuccess<{ user: User }>, void>({
      query: () => ({
        method: 'GET',
        url: 'authentication/user',
      }),
    }),
  }),
});

export const { useGetUserQuery } = userApi;
