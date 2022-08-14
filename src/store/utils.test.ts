import {
  getData,
  getError,
  hasData,
  hasError,
  isFailure,
  isSuccess,
  responseMatches,
} from './utils';
import {
  buildFailureResponse,
  buildSuccessResponse,
  fetchErrorResponse,
  serializedErrorResponse,
} from './test-helpers';
import type {
  ApiData,
  ApiError,
  FetchFailure,
  FetchResponse,
  FetchSuccess,
} from './types';

const apiData: ApiData = {
  name: 'Alan Bradley',
  role: 'user',
};
const apiError: ApiError = {
  data: {},
  message: 'something went wrong',
  type: 'generic.error',
};
const failureResponse: FetchFailure = buildFailureResponse();
const failureResponseWithError: FetchFailure = buildFailureResponse({
  error: apiError,
});
const successResponse: FetchSuccess = buildSuccessResponse();
const successResponseWithData: FetchSuccess = buildSuccessResponse({
  data: apiData,
});

describe('store utils', () => {
  describe('getData', () => {
    it('should be a function', () => {
      expect(typeof getData).toBe('function');
    });

    describe('with a fetch error response', () => {
      const response: FetchFailure = fetchErrorResponse;

      it('should return null', () => {
        expect(getData(response)).toBeNull();
      });
    });

    describe('with a serialized error response', () => {
      const response: FetchFailure = serializedErrorResponse;

      it('should return null', () => {
        expect(getData(response)).toBeNull();
      });
    });

    describe('with a failed response', () => {
      const response: FetchResponse = failureResponse;

      it('should return null', () => {
        expect(getData(response)).toBeNull();
      });
    });

    describe('with a failed response with an API error', () => {
      const response: FetchResponse = failureResponseWithError;

      it('should return null', () => {
        expect(getData(response)).toBeNull();
      });
    });

    describe('with a failed response with an API error and data', () => {
      const response: FetchResponse = buildFailureResponse({
        data: apiData,
        error: apiError,
      });

      it('should return the data', () => {
        expect(getData(response)).toEqual(apiData);
      });
    });

    describe('with a successful response', () => {
      const response: FetchResponse = successResponse;

      it('should return null', () => {
        expect(getData(response)).toBeNull();
      });
    });

    describe('with a successful response with data', () => {
      const response: FetchResponse = successResponseWithData;

      it('should return the data', () => {
        expect(getData(response)).toEqual(apiData);
      });
    });
  });

  describe('getError', () => {
    it('should be a function', () => {
      expect(typeof getError).toBe('function');
    });

    describe('with a fetch error response', () => {
      const response: FetchFailure = fetchErrorResponse;

      it('should return null', () => {
        expect(getError(response)).toBeNull();
      });
    });

    describe('with a serialized error response', () => {
      const response: FetchFailure = serializedErrorResponse;

      it('should return null', () => {
        expect(getError(response)).toBeNull();
      });
    });

    describe('with a failed response', () => {
      const response: FetchResponse = failureResponse;

      it('should return null', () => {
        expect(getError(response)).toBeNull();
      });
    });

    describe('with a failed response with an API error', () => {
      const response: FetchResponse = failureResponseWithError;

      it('should return the error', () => {
        expect(getError(response)).toEqual(apiError);
      });
    });

    describe('with a failed response with an API error and data', () => {
      const response: FetchResponse = buildFailureResponse({
        data: apiData,
        error: apiError,
      });

      it('should return the error', () => {
        expect(getError(response)).toEqual(apiError);
      });
    });

    describe('with a successful response', () => {
      const response: FetchResponse = successResponse;

      it('should return null', () => {
        expect(getError(response)).toBeNull();
      });
    });

    describe('with a successful response with data', () => {
      const response: FetchResponse = successResponseWithData;

      it('should return null', () => {
        expect(getError(response)).toBeNull();
      });
    });
  });

  describe('hasData', () => {
    it('should be a function', () => {
      expect(typeof hasData).toBe('function');
    });

    describe('with a fetch error response', () => {
      const response: FetchFailure = fetchErrorResponse;

      it('should return false', () => {
        expect(hasData(response)).toBe(false);
      });
    });

    describe('with a serialized error response', () => {
      const response: FetchFailure = serializedErrorResponse;

      it('should return false', () => {
        expect(hasData(response)).toBe(false);
      });
    });

    describe('with a failed response', () => {
      const response: FetchResponse = failureResponse;

      it('should return false', () => {
        expect(hasData(response)).toBe(false);
      });
    });

    describe('with a failed response with an API error', () => {
      const response: FetchResponse = failureResponseWithError;

      it('should return false', () => {
        expect(hasData(response)).toBe(false);
      });
    });

    describe('with a failed response with an API error and data', () => {
      const response: FetchResponse = buildFailureResponse({
        data: apiData,
        error: apiError,
      });

      it('should return true', () => {
        expect(hasData(response)).toBe(true);
      });
    });

    describe('with a successful response', () => {
      const response: FetchResponse = successResponse;

      it('should return false', () => {
        expect(hasData(response)).toBe(false);
      });
    });

    describe('with a successful response with data', () => {
      const response: FetchResponse = successResponseWithData;

      it('should return true', () => {
        expect(hasData(response)).toBe(true);
      });
    });
  });

  describe('hasError', () => {
    it('should be a function', () => {
      expect(typeof hasError).toBe('function');
    });

    describe('with a fetch error response', () => {
      const response: FetchFailure = fetchErrorResponse;

      it('should return false', () => {
        expect(hasError(response)).toBe(false);
      });
    });

    describe('with a serialized error response', () => {
      const response: FetchFailure = serializedErrorResponse;

      it('should return false', () => {
        expect(hasError(response)).toBe(false);
      });
    });

    describe('with a failed response', () => {
      const response: FetchResponse = failureResponse;

      it('should return false', () => {
        expect(hasError(response)).toBe(false);
      });
    });

    describe('with a failed response with an API error', () => {
      const response: FetchResponse = failureResponseWithError;

      it('should return true', () => {
        expect(hasError(response)).toBe(true);
      });
    });

    describe('with a failed response with an API error and data', () => {
      const response: FetchResponse = buildFailureResponse({
        data: apiData,
        error: apiError,
      });

      it('should return true', () => {
        expect(hasError(response)).toBe(true);
      });
    });

    describe('with a successful response', () => {
      const response: FetchResponse = successResponse;

      it('should return false', () => {
        expect(hasError(response)).toBe(false);
      });
    });
  });

  describe('isFailure', () => {
    it('should be a function', () => {
      expect(typeof isFailure).toBe('function');
    });

    describe('with a fetch error response', () => {
      const response: FetchFailure = fetchErrorResponse;

      it('should return true', () => {
        expect(isFailure(response)).toBe(true);
      });
    });

    describe('with a serialized error response', () => {
      const response: FetchFailure = serializedErrorResponse;

      it('should return true', () => {
        expect(isFailure(response)).toBe(true);
      });
    });

    describe('with a failed response', () => {
      const response: FetchResponse = failureResponse;

      it('should return true', () => {
        expect(isFailure(response)).toBe(true);
      });
    });

    describe('with a successful response', () => {
      const response: FetchResponse = successResponse;

      it('should return false', () => {
        expect(isFailure(response)).toBe(false);
      });
    });
  });

  describe('isSuccess', () => {
    it('should be a function', () => {
      expect(typeof isSuccess).toBe('function');
    });

    describe('with a fetch error response', () => {
      const response: FetchFailure = fetchErrorResponse;

      it('should return false', () => {
        expect(isSuccess(response)).toBe(false);
      });
    });

    describe('with a serialized error response', () => {
      const response: FetchFailure = serializedErrorResponse;

      it('should return false', () => {
        expect(isSuccess(response)).toBe(false);
      });
    });

    describe('with a failed response', () => {
      const response: FetchResponse = failureResponse;

      it('should return false', () => {
        expect(isSuccess(response)).toBe(false);
      });
    });

    describe('with a successful response', () => {
      const response: FetchResponse = successResponse;

      it('should return true', () => {
        expect(isSuccess(response)).toBe(true);
      });
    });
  });

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
      const errorType = 'specific.error';
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
