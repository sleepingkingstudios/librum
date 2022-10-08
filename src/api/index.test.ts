import fetchMock from 'jest-fetch-mock';

import '@testing-library/jest-dom';

import {
  ApiResponse,
  api,
  useGetStatusQuery,
} from './index';
import { shouldPerformTheQuery } from '@test-helpers/api';

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
    it('should be a function', () => {
      expect(typeof useGetStatusQuery).toBe('function');
    });
  });
});
