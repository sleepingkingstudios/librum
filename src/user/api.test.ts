import fetchMock from 'jest-fetch-mock';

import '@testing-library/jest-dom';

import {
  userApi as api,
  useGetUserQuery,
} from './api';
import type { ApiResponse } from '@api';
import type { User } from '@session/types';
import {
  shouldDefineTheQueryHook,
  shouldPerformTheQuery,
} from '@test-helpers/api';

beforeEach((): void => { fetchMock.resetMocks(); });

describe('User API', () => {
  const user: User = {
    email: 'alan.bradley@example.com',
    id: '00000000-0000-0000-0000-000000000000',
    role: 'user',
    slug: 'alan-bradley',
    username: 'Alan Bradley',
  };
  const data: ApiResponse<{ user: User }> = {
    ok: true,
    data: { user },
  };

  describe('GET /api/authentication/user', () => {
    const endpoint = 'getUser';

    shouldPerformTheQuery({
      api,
      data,
      endpoint,
      request: {
        method: 'GET',
        url: '/api/authentication/user',
      },
    });
  });

  describe('useGetUserQuery', () => {
    shouldDefineTheQueryHook({
      api,
      data,
      useQuery: useGetUserQuery,
    });
  });
});
