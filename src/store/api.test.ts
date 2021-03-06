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
    const data: ApiResponse = { ok: true, data: {} };

    shouldPerformTheQuery({
      api,
      data,
      endpoint,
      request: {
        url: '/api/status',
      },
    });
  });

  describe('useGetStatusQuery', () => {
    const data: ApiResponse = { ok: true, data: {} };

    shouldDefineTheQueryHook({
      api,
      data,
      useQuery: useGetStatusQuery,
    });
  });
});
