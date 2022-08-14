import {
  matchResponse,
} from './matcher';
import {
  buildFailureResponse,
  buildSuccessResponse,
  fetchErrorResponse,
  serializedErrorResponse,
} from './test-helpers';
import {
  ApiError,
  FetchFailure,
  FetchResponse,
  FetchSuccess,
  Matcher,
} from './types';

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

describe('store matchers', () => {
  describe('matchResponse()', () => {
    const options: Record<string, unknown> = { callback: jest.fn() };

    it('should be a function', () => {
      expect(typeof matchResponse).toBe('function');
    });

    describe('with status: "failure"', () => {
      const onFailure: Matcher<unknown> = jest.fn();
      const matcher: Matcher<unknown> = matchResponse({
        fn: onFailure,
        status: 'failure',
      });

      it('should return a function', () => {
        expect(typeof matcher).toBe('function');
      });

      describe('with a fetch error response', () => {
        const response: FetchFailure = fetchErrorResponse;

        it('should call the function', () => {
          matcher(response, options);

          expect(onFailure).toHaveBeenCalledWith(response, options);
        });
      });

      describe('with a serialized error response', () => {
        const response: FetchFailure = serializedErrorResponse;

        it('should call the function', () => {
          matcher(response, options);

          expect(onFailure).toHaveBeenCalledWith(response, options);
        });
      });

      describe('with a failed response', () => {
        const response: FetchResponse = failureResponse;

        it('should call the function', () => {
          matcher(response, options);

          expect(onFailure).toHaveBeenCalledWith(response, options);
        });
      });

      describe('with a successful response', () => {
        const response: FetchResponse = successResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      });
    });

    describe('with status: "failure" and an error type', () => {
      const onFailure: Matcher<unknown> = jest.fn();
      const errorType = 'specific.error';
      const matcher: Matcher<unknown> = matchResponse({
        errorType,
        fn: onFailure,
        status: 'failure',
      });

      it('should return a function', () => {
        expect(typeof matcher).toBe('function');
      });

      describe('with a fetch error response', () => {
        const response: FetchFailure = fetchErrorResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      });

      describe('with a serialized error response', () => {
        const response: FetchFailure = serializedErrorResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      });

      describe('with a failed response', () => {
        const response: FetchResponse = failureResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      });

      describe('with a failed response with a non-matching error', () => {
        const response: FetchResponse = failureResponseWithError;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      });

      describe('with a failed response with a matching error', () => {
        const error: ApiError = {
          data: {},
          message: 'something went wrong',
          type: errorType,
        };
        const response: FetchResponse = buildFailureResponse({ error });

        it('should call the function', () => {
          matcher(response, options);

          expect(onFailure).toHaveBeenCalledWith(response, options);
        });
      });

      describe('with a successful response', () => {
        const response: FetchResponse = successResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      });
    });

    describe('with status: "success"', () => {
      const onSuccess: Matcher<unknown> = jest.fn();
      const matcher: Matcher<unknown> = matchResponse({
        fn: onSuccess,
        status: 'success',
      });

      it('should return a function', () => {
        expect(typeof matcher).toBe('function');
      });

      describe('with a fetch error response', () => {
        const response: FetchFailure = fetchErrorResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onSuccess).not.toHaveBeenCalled();
        });
      });

      describe('with a serialized error response', () => {
        const response: FetchFailure = serializedErrorResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onSuccess).not.toHaveBeenCalled();
        });
      });

      describe('with a failed response', () => {
        const response: FetchResponse = failureResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onSuccess).not.toHaveBeenCalled();
        });
      });

      describe('with a successful response', () => {
        const response: FetchResponse = successResponse;

        it('should call the function', () => {
          matcher(response, options);

          expect(onSuccess).toHaveBeenCalledWith(response, options);
        });
      });
    });

    describe('with matcher: a value', () => {
      const onFailure: Matcher<unknown> = jest.fn();
      const onSuccess: Matcher<unknown> = jest.fn();
      const errorType = apiError.type;
      const matcher: Matcher<unknown> = matchResponse({
        fn: onSuccess,
        matcher: matchResponse({
          errorType,
          fn: onFailure,
          status: 'failure',
        }),
        status: 'success',
      });

      it('should return a function', () => {
        expect(typeof matcher).toBe('function');
      });

      describe('with a matching response response', () => {
        const response: FetchResponse = successResponse;

        it('should call the function', () => {
          matcher(response, options);

          expect(onSuccess).toHaveBeenCalledWith(response, options);
        });

        it('should not call the nested function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      });

      describe('with a response that matches the provided matcher', () => {
        const response: FetchResponse = failureResponseWithError;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onSuccess).not.toHaveBeenCalled();
        });

        it('should call the nested function', () => {
          matcher(response, options);

          expect(onFailure).toHaveBeenCalledWith(response, options);
        });
      });

      describe('with a response that does not match either matcher', () => {
        const response: FetchResponse = failureResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onSuccess).not.toHaveBeenCalled();
        });

        it('should not call the nested function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
        });
      })
    });
  });
});
