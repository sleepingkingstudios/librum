import { faUserClock } from '@fortawesome/free-solid-svg-icons';

import {
  camelizeErrorType,
  extractData,
  extractError,
  extractStatus,
  handleAuthenticationError
} from './utils';
import type { Alert } from '@alerts';
import { actions as sessionActions } from '@session';
import { expiredSessionError } from '../errors';
import {
  defaultResponse,
  defaultResult,
} from '../test-helpers';
import {
  ApiError,
  ApiFailure,
  ApiSuccess,
  Response,
} from '../types';

describe('API hooks utils', () => {
  describe('camelizeErrorType()', () => {
    it('should be a function', () => {
      expect(typeof camelizeErrorType).toBe('function');
    });

    describe('with an empty string', () => {
      it('should return an empty string', () => {
        expect(camelizeErrorType('')).toBe('');
      });
    });

    describe('with a non-empty string', () => {
      const str = 'greetings_programs';
      const expected = 'greetingsPrograms';

      it('should convert the string to camelCase', () => {
        expect(camelizeErrorType(str)).toEqual(expected);
      });
    });

    describe('with a period-separated string', () => {
      const str = 'example.error_types.custom_error';
      const expected = 'example.errorTypes.customError';

      it('should convert the string segments to camelCase', () => {
        expect(camelizeErrorType(str)).toEqual(expected);
      });
    });
  });

  describe('extractData()', () => {
    it('should be a function', () => {
      expect(typeof extractData).toBe('function');
    });

    it('should return undefined', () => {
      expect(extractData(defaultResult)).toBeUndefined();
    });

    describe('when the query is errored', () => {
      const erroredResult = {
        ...defaultResult,
        isError: true,
      };

      it('should return undefined', () => {
        expect(extractData(erroredResult)).toBeUndefined();
      });
    });

    describe('when the query returns a failure response', () => {
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'spec.errors.genericError',
      };
      const apiResponse: ApiFailure = {
        ok: false,
        error,
      };
      const failureResult = {
        ...defaultResult,
        error: {
          data: apiResponse,
          status: 400,
        },
        isError: true,
      };

      it('should return undefined', () => {
        expect(extractData(failureResult)).toBeUndefined();
      });
    });

    describe('when the query returns a failure response with data', () => {
      const data: Record<string, unknown> = {
        user: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'spec.errors.genericError',
      };
      const apiResponse: ApiFailure = {
        ok: false,
        data,
        error,
      };
      const failureResult = {
        ...defaultResult,
        error: {
          data: apiResponse,
          status: 400,
        },
        isError: true,
      };

      it('should return the data', () => {
        expect(extractData(failureResult)).toEqual(data);
      });
    });

    describe('when the query returns a success response', () => {
      const data: Record<string, unknown> = {
        user: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };
      const apiResponse: ApiSuccess = {
        ok: true,
        data,
      };
      const successResult = {
        ...defaultResult,
        data: apiResponse,
        isSuccess: true,
      };

      it('should return the data', () => {
        expect(extractData(successResult)).toEqual(data);
      });
    });
  });

  describe('extractError()', () => {
    it('should be a function', () => {
      expect(typeof extractError).toBe('function');
    });

    it('should return undefined', () => {
      expect(extractError(defaultResult)).toBeUndefined();
    });

    describe('when the query is errored', () => {
      const erroredResult = {
        ...defaultResult,
        isError: true,
      };

      it('should return undefined', () => {
        expect(extractError(erroredResult)).toBeUndefined();
      });
    });

    describe('when the query returns a failure response', () => {
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'spec.errors.genericError',
      };
      const apiResponse: ApiFailure = {
        ok: false,
        error,
      };
      const failureResult = {
        ...defaultResult,
        error: {
          data: apiResponse,
          status: 400,
        },
        isError: true,
      };

      it('should return the error', () => {
        expect(extractError(failureResult)).toEqual(error);
      });
    });

    describe('when the query returns a failure response with data', () => {
      const data: Record<string, unknown> = {
        user: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'spec.errors.genericError',
      };
      const apiResponse: ApiFailure = {
        ok: false,
        data,
        error,
      };
      const failureResult = {
        ...defaultResult,
        error: {
          data: apiResponse,
          status: 400,
        },
        isError: true,
      };

      it('should return the error', () => {
        expect(extractError(failureResult)).toEqual(error);
      });
    });

    describe('when the query returns a success response', () => {
      const data: Record<string, unknown> = {
        user: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };
      const apiResponse: ApiSuccess = {
        ok: true,
        data,
      };
      const successResult = {
        ...defaultResult,
        data: apiResponse,
        isSuccess: true,
      };

      it('should return undefined', () => {
        expect(extractError(successResult)).toBeUndefined();
      });
    });
  });

  describe('extractStatus()', () => {
    it('should be a function', () => {
      expect(typeof extractStatus).toBe('function');
    });

    it('should return "unknown"', () => {
      expect(typeof extractStatus).toBe('function');
    });

    describe('when the query is uninitialized', () => {
      const uninitializedResult = {
        ...defaultResult,
        isUninitialized: true,
      };

      it('should return "uninitialized"', () => {
        expect(extractStatus(uninitializedResult)).toBe('uninitialized');
      });
    });

    describe('when the query is loading', () => {
      const loadingResult = {
        ...defaultResult,
        isLoading: true,
      };

      it('should return "uninitialized"', () => {
        expect(extractStatus(loadingResult)).toBe('loading');
      });
    });

    describe('when the query is errored', () => {
      const erroredResult = {
        ...defaultResult,
        isError: true,
      };

      it('should return "errored"', () => {
        expect(extractStatus(erroredResult)).toBe('errored');
      });
    });

    describe('when the query returns a failure response', () => {
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'spec.errors.genericError',
      };
      const apiResponse: ApiFailure = {
        ok: false,
        error,
      };
      const failureResult = {
        ...defaultResult,
        error: {
          data: apiResponse,
          status: 400,
        },
        isError: true,
      };

      it('should return "failure"', () => {
        expect(extractStatus(failureResult)).toBe('failure');
      });
    });

    describe('when the query returns a success response', () => {
      const data: Record<string, unknown> = {
        user: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };
      const apiResponse: ApiSuccess = {
        ok: true,
        data,
      };
      const successResult = {
        ...defaultResult,
        data: apiResponse,
        isSuccess: true,
      };

      it('should return "success"', () => {
        expect(extractStatus(successResult)).toBe('success');
      });
    });
  });

  describe('handleAuthenticationError()', () => {
    const displayAlert = jest.fn();
    const alerts = {
      alerts: [] as Alert[],
      dismissAlert: jest.fn(),
      dismissAllAlerts: jest.fn(),
      displayAlert,
    };
    const dispatch = jest.fn();

    afterEach(() => { localStorage.clear(); });

    it('should be a function', () => {
      expect(typeof handleAuthenticationError).toBe('function');
    });

    describe('with a failure response', () => {
      const response: Response = {
        ...defaultResponse,
        isFailure: true,
        status: 'failure',
      };

      it('should not clear the session', () => {
        localStorage.setItem('session', JSON.stringify({ authenticated: true }));

        handleAuthenticationError({ alerts, dispatch, response });

        expect(dispatch).not.toHaveBeenCalled();
        expect(displayAlert).not.toHaveBeenCalled();
        expect(localStorage.getItem('session')).not.toBeNull();
      });
    });

    describe('with a failure response with an error', () => {
      const error = {
        data: {},
        message: 'Something went wrong',
        type: 'spec.errors.genericError',
      };
      const response: Response = {
        ...defaultResponse,
        error,
        errorType: 'spec.errors.genericError',
        hasError: true,
        isFailure: true,
        status: 'failure',
      };

      it('should not clear the session', () => {
        localStorage.setItem('session', JSON.stringify({ authenticated: true }));

        handleAuthenticationError({ alerts, dispatch, response });

        expect(dispatch).not.toHaveBeenCalled();
        expect(displayAlert).not.toHaveBeenCalled();
        expect(localStorage.getItem('session')).not.toBeNull();
      });
    });

    describe('with a failure response with an expired session error', () => {
      const error: ApiError = {
        data: {},
        message: 'The auth session has expired',
        type: expiredSessionError,
      };
      const response: Response = {
        ...defaultResponse,
        error,
        errorType: expiredSessionError,
        hasError: true,
        isFailure: true,
        status: 'failure',
      };
      const expectedAction = sessionActions.destroy();
      const expectedAlert = {
        context: 'authentication:session',
        icon: faUserClock,
        message: 'Your login session has expired',
        type: 'warning',
      };

      it('should clear the session', () => {
        localStorage.setItem('session', JSON.stringify({ authenticated: true }));

        handleAuthenticationError({ alerts, dispatch, response });

        expect(dispatch).toHaveBeenCalledWith(expectedAction);
        expect(displayAlert).toHaveBeenCalledWith(expectedAlert);
        expect(localStorage.getItem('session')).toBeNull();
      });
    });
  });
});
