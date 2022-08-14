import type { FetchResponse } from '@store/api';
import { matcherMiddleware } from './middleware';
import {
  buildSuccessResponse,
} from './test-helpers';

const successResponse: FetchResponse = buildSuccessResponse();

const wrapResponse = (response: FetchResponse): Promise<FetchResponse> => {
  return new Promise((resolve) => resolve(response));
};

describe('store middleware', () => {
  describe('matcherMiddleware()', () => {
    const matcher = jest.fn();
    const options = { callback: jest.fn() };
    const fn = jest.fn(() => wrapResponse(successResponse));
    const params = { ok: true };

    beforeEach(() => { fn.mockClear(); });

    it('should be a function', () => {
      expect(typeof matcherMiddleware).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof matcherMiddleware(matcher, options))
        .toBe('function');
    });

    it('should call the inner function', async () => {
      const middleware = matcherMiddleware(matcher, options);

      await middleware(fn, params);

      expect(fn).toHaveBeenCalledWith(params);
    });

    it('should call the matcher', async () => {
      const middleware = matcherMiddleware(matcher, options);

      await middleware(fn, params);

      expect(matcher).toHaveBeenCalledWith(successResponse, options);
    });
  });
});
