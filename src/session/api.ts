import { IUser } from './user';
import {
  ApiResponse,
  api,
} from '@store';

export type Login = {
  password: string;
  username: string;
};

export const sessionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation<ApiResponse<{ token: string, user: IUser }>, Login>({
      query: (body: Login) => ({
        method: 'POST',
        url: 'session',
        body,
      }),
    }),
  }),
});

export const { useCreateSessionMutation } = sessionApi;
