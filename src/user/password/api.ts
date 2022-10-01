import { api } from '@api';
import type { ApiSuccess } from '@api';
import type { SnakeToCamelCaseObject } from '@utils/types';

export type PasswordUpdateInternal = {
  old_password: string,
  new_password: string,
  confirm_password: string,
};

export type PasswordUpdate = SnakeToCamelCaseObject<PasswordUpdateInternal>;

export const userPasswordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUserPassword: builder.mutation<ApiSuccess<Record<string, never>>, PasswordUpdateInternal>({
      query: (body: PasswordUpdate) => ({
        method: 'PATCH',
        url: 'authentication/user/password',
        body,
      }),
    }),
  }),
});

export const { useUpdateUserPasswordMutation } = userPasswordApi;
