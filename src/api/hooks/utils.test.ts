import {
  camelizeErrorType,
  extractData,
  extractError,
  extractStatus,
} from './utils';
import {
  ApiError,
  ApiFailure,
  ApiSuccess,
} from '../types';
import type {
  UseQueryResult,
} from './types';

describe('API hooks utils', () => {
  const defaultResult: UseQueryResult= {
    isUninitialized: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
  };

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
});
