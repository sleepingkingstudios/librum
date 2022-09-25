import {
  buildFailureResponse,
  buildSuccessResponse,
  fetchErrorResponse,
  serializedErrorResponse,
} from '../test-helpers';
import type {
  ApiError,
  FetchFailure,
  FetchResponse,
  FetchSuccess,
} from '../types';
import { responseMatches } from './utils';

const apiError: ApiError = {
  data: {},
  message: 'something went wrong',
  type: 'generic.error_type',
};
const failureResponse: FetchFailure = buildFailureResponse();
const failureResponseWithError: FetchFailure = buildFailureResponse({
  error: apiError,
});
const successResponse: FetchSuccess = buildSuccessResponse();

describe('store matcher utils', () => {
  describe('responseMatches()', () => {
    it('should be a function', () => {
      expect(typeof responseMatches).toBe('function');
    });

    describe('with status: "failure"', () => {
      const status = 'failure';

      describe('with a fetch error response', () => {
        const response: FetchFailure = fetchErrorResponse;

        it('should return true', () => {
          expect(responseMatches({ response, status })).toBe(true);
        });
      });

      describe('with a serialized error response', () => {
        const response: FetchFailure = serializedErrorResponse;

        it('should return true', () => {
          expect(responseMatches({ response, status })).toBe(true);
        });
      });

      describe('with a failed response', () => {
        const response: FetchResponse = failureResponse;

        it('should return true', () => {
          expect(responseMatches({ response, status })).toBe(true);
        });
      });

      describe('with a successful response', () => {
        const response: FetchResponse = successResponse;

        it('should return false', () => {
          expect(responseMatches({ response, status })).toBe(false);
        });
      });
    });

    describe('with status: "failure" and an error type', () => {
      const errorType = 'specific.error_type';
      const status = 'failure';

      describe('with a fetch error response', () => {
        const response: FetchFailure = fetchErrorResponse;

        it('should return false', () => {
          expect(responseMatches({ errorType, response, status })).toBe(false);
        });
      });

      describe('with a serialized error response', () => {
        const response: FetchFailure = serializedErrorResponse;

        it('should return false', () => {
          expect(responseMatches({ errorType, response, status })).toBe(false);
        });
      });

      describe('with a failed response', () => {
        const response: FetchResponse = buildFailureResponse();

        it('should return false', () => {
          expect(responseMatches({ errorType, response, status })).toBe(false);
        });
      });

      describe('with a failed response with a non-matching API error', () => {
        const response: FetchResponse = failureResponseWithError;

        it('should return false', () => {
          expect(responseMatches({ errorType, response, status })).toBe(false);
        });
      });

      describe('with a failed response with a matching API error', () => {
        const response: FetchResponse = buildFailureResponse({
          error: {
            data: {},
            message: 'something went wrong',
            type: errorType,
          },
        });

        it('should return true', () => {
          expect(responseMatches({ errorType, response, status })).toBe(true);
        });
      });

      describe('with a failed response with a camelCase API error', () => {
        const response: FetchResponse = buildFailureResponse({
          error: {
            data: {},
            message: 'something went wrong',
            type: 'specific.errorType',
          },
        });

        it('should return true', () => {
          expect(responseMatches({ errorType, response, status })).toBe(true);
        });
      });

      describe('with a successful response', () => {
        const response: FetchResponse = successResponse;

        it('should return false', () => {
          expect(responseMatches({ errorType, response, status })).toBe(false);
        });
      });
    });

    describe('with status: "success"', () => {
      const status = 'success';

      describe('with a fetch error response', () => {
        const response: FetchFailure = fetchErrorResponse;

        it('should return true', () => {
          expect(responseMatches({ response, status })).toBe(false);
        });
      });

      describe('with a serialized error response', () => {
        const response: FetchFailure = serializedErrorResponse;

        it('should return true', () => {
          expect(responseMatches({ response, status })).toBe(false);
        });
      });

      describe('with a failed response', () => {
        const response: FetchResponse = buildFailureResponse();

        it('should return false', () => {
          expect(responseMatches({ response, status })).toBe(false);
        });
      });

      describe('with a successful response', () => {
        const response: FetchResponse = buildSuccessResponse();

        it('should return true', () => {
          expect(responseMatches({ response, status })).toBe(true);
        });
      });
    });
  });
});
