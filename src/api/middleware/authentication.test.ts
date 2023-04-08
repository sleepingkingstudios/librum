import { faUserClock } from '@fortawesome/free-solid-svg-icons';

import { authenticationMiddleware } from './authentication';
import type { Alert } from '@alerts';
import { expiredSessionError } from '@api/errors';
import { actions as sessionActions } from '@session';
import type { Session } from '@session';
import type {
  ApiError,
  HttpMethod,
  MiddlewareOptions,
  PerformRequest,
  RequestOptions,
  Response,
} from '../types';
import {
  withError,
  withStatus,
} from '../utils';

describe('API request middleware', () => {
  const displayAlert = jest.fn();
  const alerts = {
    alerts: [] as Alert[],
    dismissAlert: jest.fn(),
    dismissAllAlerts: jest.fn(),
    displayAlert,
  };
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();

    displayAlert.mockClear();
  });

  afterEach(() => { localStorage.clear(); });

  describe('authenticationMiddleware()', () => {
    const response: Response = withStatus({ status: 'success' });
    const performRequest: jest.MockedFunction<PerformRequest> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (url, options) => new Promise(resolve => resolve(response)),
    );
    const config: MiddlewareOptions = {
      alerts,
      dispatch,
    };
    const url = 'www.example.com';
    const method: HttpMethod = 'post';
    const options = { method };
    const applied = authenticationMiddleware(performRequest, config);

    beforeEach(() => {
      performRequest.mockClear();
    });

    it('should be a function', () => {
      expect(typeof authenticationMiddleware).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof applied).toBe('function');
    });

    it('should perform the request', async () => {
      await applied(url, options);

      expect(performRequest).toHaveBeenCalledWith(url, options);
    });

    it('should return the response', async () => {
      const response = await applied(url, options);
      const expected = withStatus({ status: 'success' });

      expect(response).toEqual(expected);
    });

    describe('when the response has an api error', () => {
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'test.errorType',
      };
      const response = withError({
        error,
        response: withStatus({ status: 'failure' }),
      });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(response)),
        );
      });

      it('should return the response', async () => {
        const response = await applied(url, options);
        const expected = withError({
          error,
          response: withStatus({ status: 'failure' }),
        });

        expect(response).toEqual(expected);
      });

      it('should not clear the session', async () => {
        localStorage.setItem(
          'session',
          JSON.stringify({ authenticated: true }),
        );

        await applied(url, options);

        expect(dispatch).not.toHaveBeenCalled();
        expect(displayAlert).not.toHaveBeenCalled();
        expect(localStorage.getItem('session')).not.toBeNull();
      });
    });

    describe('when the response has an authentication error', () => {
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: expiredSessionError,
      };
      const response = withError({
        error,
        errorType: error.type,
        response: withStatus({ status: 'failure' }),
      });
      const expectedAction = sessionActions.destroy();
      const expectedAlert = {
        context: 'authentication:session',
        icon: faUserClock,
        message: 'Your login session has expired',
        type: 'warning',
      };

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(response)),
        );
      });

      it('should return the response', async () => {
        const response = await applied(url, options);
        const expected: Response = {
          ...withError({ error, errorType: error.type }),
          isFailure: true,
          meta: { alerted: true },
          status: 'failure',
        };

        expect(response).toEqual(expected);
      });

      it('should clear the session', async () => {
        localStorage.setItem(
          'session',
          JSON.stringify({ authenticated: true }),
        );

        await applied(url, options);

        expect(dispatch).toHaveBeenCalledWith(expectedAction);
        expect(displayAlert).toHaveBeenCalledWith(expectedAlert);
        expect(localStorage.getItem('session')).toBeNull();
      });
    });

    describe('with an authenticated session', () => {
      const token = '12345';
      const session: Session = { authenticated: true, token };
      const config: MiddlewareOptions = { session };
      const applied = authenticationMiddleware(performRequest, config);
      const options: RequestOptions = {
        headers: {
          'X-Custom-Header': 'value',
        },
        method,
      };
      const expectedOptions: RequestOptions = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Custom-Header': 'value',
        },
        method,
      };

      it('should authenticate the request', async () => {
        await applied(url, options);

        expect(performRequest).toHaveBeenCalledWith(url, expectedOptions);
      });
    });

    describe('with an unauthenticated session', () => {
      const session: Session = { authenticated: false };
      const config: MiddlewareOptions = { session };
      const applied = authenticationMiddleware(performRequest, config);

      it('should perform the request', async () => {
        await applied(url, options);

        expect(performRequest).toHaveBeenCalledWith(url, options);
      });
    });
  });
});
