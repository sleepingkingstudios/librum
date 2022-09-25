import type { FetchResponse } from '@api';
import type { Annotations } from '@utils/annotations';
import { matcherMiddleware } from './middleware';
import {
  buildSuccessResponse,
  wrapResponse,
} from '../test-helpers';

const successResponse: FetchResponse = buildSuccessResponse();

describe('api matcher', () => {
  describe('matcherMiddleware()', () => {
    const matcher = jest.fn();
    const options = { callback: jest.fn() };
    const fn = jest.fn(() => wrapResponse(successResponse));
    const params = { ok: true };

    beforeEach(() => { fn.mockClear(); });

    it('should be a function', () => {
      expect(typeof matcherMiddleware).toBe('function');
    });

    describe('with a matcher', () => {
      const builder = matcherMiddleware(matcher);
      const middleware = builder(options);

      it('should return a builder function', () => {
        expect(typeof builder).toBe('function');
      });

      it('should return the middleware', () => {
        expect(typeof middleware).toBe('function');
      });

      it('should call the inner function', async () => {
        await middleware(fn, params);

        expect(fn).toHaveBeenCalledWith(params);
      });

      it('should call the matcher', async () => {
        await middleware(fn, params);

        expect(matcher).toHaveBeenCalledWith(successResponse, options);
      });

      it('should not annotate the builder function', () => {
        expect(builder.annotations).toBeUndefined();
      });
    });

    describe('with a matcher and annotations', () => {
      const annotations: Annotations = {
        name: 'test:middleware',
      };
      const builder = matcherMiddleware(matcher, annotations);

      it('should annotate the builder function', () => {
        const expected = {
          matcher,
          name: 'test:middleware',
          type: 'api:middleware:matcher',
        };

        expect(builder.annotations).toEqual(expected);
      });
    });
  });
});
