import fetchMock from 'jest-fetch-mock';

import '@testing-library/jest-dom';

import {
  ApiResponse,
  api,
  useGetStatusQuery,
} from './api';
import {
  shouldDefineTheQueryHook,
  shouldPerformTheQuery,
} from '@test-helpers/api';

beforeEach((): void => { fetchMock.resetMocks(); });

describe('Status API', () => {
  describe('GET /api/status', () => {
    const endpoint = 'getStatus';
    const status: ApiResponse = { ok: true, data: {} };

    shouldPerformTheQuery({
      api,
      data: status,
      endpoint,
      request: {
        url: '/api/status',
      },
    });
  });

  describe('useGetStatusQuery', () => {
    shouldDefineTheQueryHook({
      api,
      data: status,
      request: {
        url: '/api/status',
      },
      useQuery: useGetStatusQuery,
    });
  });
});
