import type { FetchResponse } from '@api';
import { convertRequestToSnakeCase } from '../middleware';
import {
  buildSuccessResponse,
  wrapResponse,
} from '../test-helpers';

const successResponse: FetchResponse = buildSuccessResponse();

describe('api middleware', () => {
  describe('convertRequestToSnakeCase', () => {
    const fn = jest.fn(() => wrapResponse(successResponse));
    const options: Record<string, never> = {};
    const middleware = convertRequestToSnakeCase(options);

    beforeEach(() => { fn.mockClear(); });

    it('should be a function', () => {
      expect(typeof convertRequestToSnakeCase).toBe('function');
    });

    it('should return the middleware', () => {
      expect(typeof middleware).toBe('function');
    });

    describe('with simple params', () => {
      const params = { ok: true };

      it('should call the inner function', async () => {
        await middleware(fn, params);

        expect(fn).toHaveBeenCalledWith(params);
      });
    });

    describe('with data params', () => {
      const params = {
        ok: true,
        userData: {
          firstName: 'Alan',
          lastName: 'Bradley'
        },
      };
      const expected = {
        ok: true,
        user_data: {
          first_name: 'Alan',
          last_name: 'Bradley'
        },
      };

      it('should call the inner function', async () => {
        await middleware(fn, params);

        expect(fn).toHaveBeenCalledWith(expected);
      });
    });
  });
});
