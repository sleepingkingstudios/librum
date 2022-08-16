import type { Annotations } from '@utils/annotations';
import {
  matchResponse,
  reduceMatchers,
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
      const onFailure = jest.fn();
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
      const onFailure = jest.fn();
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
      const onSuccess = jest.fn();
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
      const onFailure = jest.fn();
      const onSuccess = jest.fn();
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

  describe('reduceMatchers', () => {
    const options: Record<string, unknown> = { callback: jest.fn() };

    it('should be a function', () => {
      expect(typeof reduceMatchers).toBe('function');
    });

    describe('with no matchers', () => {
      it('should return null', () => {
        const matcher = reduceMatchers([]);

        expect(matcher).toBeNull();
      });
    });

    describe('with one matcher', () => {
      const onSuccess = jest.fn();
      const matcher: Matcher<unknown> = reduceMatchers([{
        fn: onSuccess,
        status: 'success',
      }]);

      beforeEach(() => {
        onSuccess.mockClear();
      });

      it('should return a function', () => {
        expect(typeof matcher).toBe('function');
      });

      it('should not annotate the matcher', () => {
        const { annotations } = matcher;

        expect(annotations).toBeUndefined();
      });

      describe('with a non-matching response', () => {
        const response: FetchFailure = failureResponse;

        it('should not call the function', () => {
          matcher(response, options);

          expect(onSuccess).not.toHaveBeenCalled();
        });
      });

      describe('with a matching response', () => {
        const response: FetchSuccess = successResponse;

        it('should call the function', () => {
          matcher(response, options);

          expect(onSuccess).toHaveBeenCalledWith(response, options);
        });
      });
    });

    describe('with multiple matchers', () => {
      const onFailure = jest.fn();
      const onSuccess = jest.fn();
      const errorType = apiError.type;
      const matcher: Matcher<unknown> = reduceMatchers(
        [
          {
            fn: onSuccess,
            status: 'success',
          },
          {
            errorType,
            fn: onFailure,
            status: 'failure',
          },
        ],
      );

      it('should return a function', () => {
        expect(typeof matcher).toBe('function');
      });

      it('should not annotate the matcher', () => {
        const { annotations } = matcher;

        expect(annotations).toBeUndefined();
      });

      describe('with a successful response', () => {
        const response: FetchSuccess = successResponse;

        it('should call the matching function', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
          expect(onSuccess).toHaveBeenCalledWith(response, options);
        });
      });

      describe('with a matching failed response', () => {
        const response: FetchFailure = failureResponseWithError;

        it('should call the matching function', () => {
          matcher(response, options);

          expect(onFailure).toHaveBeenCalledWith(response, options);
          expect(onSuccess).not.toHaveBeenCalled();
        });
      });

      describe('with a non-matching failed response', () => {
        const response: FetchFailure = failureResponse;

        it('should not call the functions', () => {
          matcher(response, options);

          expect(onFailure).not.toHaveBeenCalled();
          expect(onSuccess).not.toHaveBeenCalled();
        });
      });
    });

    describe('with name: value', () => {
      const matcher: Matcher<unknown> = reduceMatchers(
        [
          {
            fn: jest.fn(),
            status: 'success',
          }
        ],
        { name: 'test:matcher' },
      );

      it('should annotate the matcher', () => {
        const expected: Annotations = {
          name: 'test:matcher',
          type: 'matcher',
        };
        const { annotations } = matcher;

        expect(annotations).toEqual(expected);
      });
    });

    describe('with name: value and options: value', () => {
      const matcher: Matcher<unknown> = reduceMatchers(
        [
          {
            fn: jest.fn(),
            status: 'success',
          }
        ],
        {
          name: 'test:matcher',
          options: {
            key: 'value',
          },
        },
      );

      it('should annotate the matcher', () => {
        const expected: Annotations = {
          name: 'test:matcher',
          options: { key: 'value' },
          type: 'matcher',
        };
        const { annotations } = matcher;

        expect(annotations).toEqual(expected);
      });
    });

    describe('with name: value and type: value', () => {
      const matcher: Matcher<unknown> = reduceMatchers(
        [
          {
            fn: jest.fn(),
            status: 'success',
          }
        ],
        {
          name: 'test:matcher',
          type: 'customMatcher',
        },
      );

      it('should annotate the matcher', () => {
        const expected: Annotations = {
          name: 'test:matcher',
          type: 'customMatcher',
        };
        const { annotations } = matcher;

        expect(annotations).toEqual(expected);
      });
    });

    describe('with name: value and properties', () => {
      const matcher: Matcher<unknown> = reduceMatchers(
        [
          {
            fn: jest.fn(),
            status: 'success',
          }
        ],
        {
          name: 'test:matcher',
          secret: 12345,
        },
      );

      it('should annotate the matcher', () => {
        const expected: Annotations = {
          name: 'test:matcher',
          secret: 12345,
          type: 'matcher',
        };
        const { annotations } = matcher;

        expect(annotations).toEqual(expected);
      });
    });
  });
});
