import fetchMock from 'jest-fetch-mock';

import '@testing-library/jest-dom';

import {
  sessionApi as api,
  useCreateSessionMutation,
} from './api';
import type { Login } from './api';
import type { User } from './types';
import type { ApiResponse } from '@store/api';
import {
  shouldDefineTheMutationHook,
  shouldPerformTheMutation,
} from '@test-helpers/api';

beforeEach((): void => { fetchMock.resetMocks(); });

describe('Session API', () => {
  const param: Login = {
    username: 'alan.bradley@example.com',
    password: 'tronlives',
  };
  const user: User = {
    email: 'alan.bradley@example.com',
    id: '00000000-0000-0000-0000-000000000000',
    role: 'user',
    slug: 'alan-bradley',
    username: 'Alan Bradley',
  };
  const data: ApiResponse<{ token: string, user: User }> = {
    ok: true,
    data: {
      token: '12345',
      user,
    },
  };

  describe('GET /api/status', () => {
    const endpoint = 'createSession';

    shouldPerformTheMutation({
      api,
      data,
      endpoint,
      param,
      request: {
        method: 'POST',
        url: '/api/session',
      },
    });
  });

  describe('useGetStatusQuery', () => {
    const data: ApiResponse = { ok: true, data: {} };

    shouldDefineTheMutationHook({
      api,
      data,
      param,
      useMutation: useCreateSessionMutation,
    });
  });
});
