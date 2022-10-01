import fetchMock from 'jest-fetch-mock';

import '@testing-library/jest-dom';

import type { ApiResponse } from '@api';
import {
  shouldDefineTheMutationHook,
  shouldPerformTheMutation,
} from '@test-helpers/api';
import {
  userPasswordApi as api,
  useUpdateUserPasswordMutation,
} from './api';
import type { PasswordUpdateInternal } from './api';

beforeEach((): void => { fetchMock.resetMocks(); });

describe('User Password API', () => {
  const data: ApiResponse<Record<string, never>> = {
    ok: true,
    data: {},
  };
  const param: PasswordUpdateInternal = {
    old_password: '12345',
    new_password: '67890',
    confirm_password: 'abcde',
  };

  describe('PATCH /api/authentication/user/password', () => {
    const endpoint = 'updateUserPassword';

    shouldPerformTheMutation({
      api,
      data,
      endpoint,
      param,
      request: {
        method: 'PATCH',
        url: '/api/authentication/user/password',
      },
    });
  });

  describe('useUpdateUserPasswordMutation', () => {
    shouldDefineTheMutationHook({
      api,
      data,
      param,
      useMutation: useUpdateUserPasswordMutation,
    });
  });
});
