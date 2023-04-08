import {
  applyMiddleware,
  applyWildcards,
  emptyResponse,
  formatBody,
  formatParams,
  mapData,
  withData,
  withError,
  withStatus,
} from './utils';
import type {
  Middleware,
  PerformRequest,
  RequestParams,
  Response,
  ResponseData,
} from './types';

describe('API utils', () => {
  describe('applyMiddleware()', () => {
    const successResponse = withData({ data: { ok: true } });
    const performRequest: jest.MockedFunction<PerformRequest> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (url) => new Promise(resolve => resolve(successResponse))
    );
    const authorizationMiddleware: Middleware = (fn, config) => {
      const getState = config.getState as (key: string) => string;
      const authorization = getState('authorization');

      return (url, options) => {
        const headers = {
          ...(options.headers || {}),
          Authorization: authorization,
        };

        return fn(url, { ...options, headers });
      };
    };
    const cacheMiddleware: Middleware = (fn, config) => {
      const getState = config.getState as (key: string) => string;

      return (url, options) => {
        const { wildcards } = options;
        const { id } = wildcards;
        const cached = getState(id);

        if (cached) {
          const response = withStatus({
            response: withData({
              data: {
                data: JSON.parse(cached) as Record<string, unknown>,
                ok: true,
              },
            }),
            status: 'success',
          });

          return new Promise(resolve => resolve(response));
        }

        return fn(url, options);
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ignoreFailureMiddleware: Middleware = (fn, config) => {
      return (url, options) => {
        return fn(url, options)
          .then((response) => {
            const { status } = response;

            if (status === 'success') { return response; }

            return withStatus({ status: 'success' });
          });
      };
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const requireAuthorizationMiddleware: Middleware = (fn, config) => {
      return (url, options) => {
        const { headers } = options;

        if (!('Authorization' in headers)) {
          const response = withStatus({ status: 'failure' });

          return new Promise(resolve => resolve(response));
        }

        return fn(url, options);
      };
    };
    const url = 'www.example.com';
    const options = { wildcards: { id: 'on-war' } };
    const getState = (key: string): string => {
      if (key === 'authorization') { return 'Bearer 12345'; }

      if (key === 'on-war') {
        return JSON.stringify({ id: 'on-war', author: 'Clausewitz' });
      }

      return null;
    };

    it('should be a function', () => {
      expect(typeof applyMiddleware).toBe('function');
    });

    describe('with an empty middleware array', () => {
      const middleware: Middleware[] = [];
      const applied = applyMiddleware({ middleware, performRequest });

      it('should be a function', () => {
        expect(typeof applied).toBe('function');
      });

      it('should perform the request', async () => {
        await applied(url, options);

        expect(performRequest).toHaveBeenCalledWith(url, options);
      });

      it('should return a response', async () => {
        const received = await applied(url, options);

        expect(received).toEqual(successResponse);
      });
    });

    describe('with middleware that modifies the request', () => {
      const config = { getState };
      const middleware: Middleware[] = [authorizationMiddleware];
      const applied = applyMiddleware({
        config,
        middleware,
        performRequest,
      });

      it('should return a function', () => {
        expect(typeof applied).toBe('function');
      });

      it('should perform the request', async () => {
        const expected = {
          ...options,
          headers: {
            Authorization: getState('authorization'),
          },
        };

        await applied(url, options);

        expect(performRequest).toHaveBeenCalledWith(url, expected);
      });

      it('should return a response', async () => {
        const received = await applied(url, options);

        expect(received).toEqual(successResponse);
      });
    });

    describe('with middleware that modifies the response', () => {
      const middleware: Middleware[] = [ignoreFailureMiddleware];
      const applied = applyMiddleware({ middleware, performRequest });

      it('should return a function', () => {
        expect(typeof applied).toBe('function');
      });

      it('should perform the request', async () => {
        await applied(url, options);

        expect(performRequest).toHaveBeenCalledWith(url, options);
      });

      describe('with a failing response', () => {
        const failureResponse = withStatus({ status: 'failure' });
        const expectedResponse = withStatus({ status: 'success' });

        beforeEach(() => {
          performRequest.mockImplementationOnce(
            () => (new Promise(resolve => resolve(failureResponse))),
          );
        });

        it('should return the modified response', async () => {
          const received = await applied(url, options);

          expect(received).toEqual(expectedResponse);
        });
      });

      describe('with a successful response', () => {
        it('should return a response', async () => {
          const received = await applied(url, options);

          expect(received).toEqual(successResponse);
        });
      });
    });

    describe('with middleware that preempts the request', () => {
      const config = { getState };
      const middleware: Middleware[] = [cacheMiddleware];
      const applied = applyMiddleware({
        config,
        middleware,
        performRequest,
      });

      it('should return a function', () => {
        expect(typeof applied).toBe('function');
      });

      describe('with non-matching options', () => {
        const options = { wildcards: { id: 'the-art-of-war' } };

        it('should perform the request', async () => {
          await applied(url, options);

          expect(performRequest).toHaveBeenCalledWith(url, options);
        });

        it('should return a response', async () => {
          const received = await applied(url, options);

          expect(received).toEqual(successResponse);
        });
      });

      describe('with matching options', () => {
        const data = {
          ok: true,
          data: {
            id: 'on-war',
            author: 'Clausewitz',
          },
        };
        const cachedResponse = withData({
          data,
          response: withStatus({ status: 'success' }),
        });

        it('should not perform the request', async () => {
          await applied(url, options);

          expect(performRequest).not.toHaveBeenCalled();
        });

        it('should return a cached response', async () => {
          const received = await applied(url, options);

          expect(received).toEqual(cachedResponse);
        });
      });
    });

    describe('with multiple middleware functions', () => {
      const config = { getState };
      const middleware = [
        requireAuthorizationMiddleware,
        authorizationMiddleware,
      ];
      const applied = applyMiddleware({
        config,
        middleware,
        performRequest,
      });

      it('should return a function', () => {
        expect(typeof applied).toBe('function');
      });

      it('should perform the request', async () => {
        const expected = {
          ...options,
          headers: {
            Authorization: getState('authorization'),
          },
        };

        await applied(url, options);

        expect(performRequest).toHaveBeenCalledWith(url, expected);
      });

      it('should return a response', async () => {
        const received = await applied(url, options);

        expect(received).toEqual(successResponse);
      });
    });
  });

  describe('applyWildcards()', () => {
    beforeEach(() => {
      jest
        .spyOn(console, 'log')
        .mockImplementation((): null => null);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should be a function', () => {
      expect(typeof applyWildcards).toBe('function');
    });

    describe('with url: undefined', () => {
      it('should return an empty string', () => {
        expect(applyWildcards({ url: undefined, wildcards: {} })).toBe('');
      });
    });

    describe('with url: null', () => {
      it('should return an empty string', () => {
        expect(applyWildcards({ url: null, wildcards: {} })).toBe('');
      });
    });

    describe('with url: an empty string', () => {
      it('should return an empty string', () => {
        expect(applyWildcards({ url: '', wildcards: {} })).toBe('');
      });
    });

    describe('with url: a string with no wildcards', () => {
      const url = '/path/to/resource';

      it('should return the url', () => {
        expect(applyWildcards({ url, wildcards: {} })).toEqual(url);
      });

      describe('with extra wildcards', () => {
        const wildcards = { key: 'value' };

        it('should return the url', () => {
          expect(applyWildcards({ url, wildcards })).toEqual(url);
        });
      });
    });

    describe('with url: a string with one wildcard', () => {
      const url = '/path/to/resource/:id';

      describe('with empty wildcards', () => {
        const wildcards = {};

        it('should throw an error', () => {
          const expected = `invalid wildcard ":id" in url "${url}"`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with mismatched wildcards', () => {
        const wildcards = { key: 'value' };

        it('should throw an error', () => {
          const expected =
            `invalid wildcard ":id" in url "${url}" - valid keys are :key`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with valid wildcards', () => {
        const wildcards = { id: '12345' };

        it('should apply the wildcards to the url', () => {
          const expected = `/path/to/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });

      describe('with extra wildcards', () => {
        const wildcards = { id: '12345', key: 'value' };

        it('should apply the wildcards to the url', () => {
          const expected = `/path/to/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });
    });

    describe('with url: a string with multiple wildcards', () => {
      const url = '/path/:namespace/resource/:id';

      describe('with empty wildcards', () => {
        const wildcards = {};

        it('should throw an error', () => {
          const expected = `invalid wildcard ":namespace" in url "${url}"`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with mismatched wildcards', () => {
        const wildcards = { key: 'value' };

        it('should throw an error', () => {
          const expected =
            `invalid wildcard ":namespace" in url "${url}" - valid keys are :key`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with partial wildcards', () => {
        const wildcards = { namespace: 'library' };

        it('should throw an error', () => {
          const expected =
            `invalid wildcard ":id" in url "${url}" - valid keys are :namespace`;

          expect(() => applyWildcards({ url, wildcards })).toThrow(expected);
        });
      });

      describe('with valid wildcards', () => {
        const wildcards = { id: '12345', namespace: 'library' };

        it('should apply the wildcards to the url', () => {
          const expected =
            `/path/${wildcards.namespace}/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });

      describe('with extra wildcards', () => {
        const wildcards = { id: '12345', key: 'value', namespace: 'library' };

        it('should apply the wildcards to the url', () => {
          const expected =
            `/path/${wildcards.namespace}/resource/${wildcards.id}`;

          expect(applyWildcards({ url, wildcards })).toEqual(expected);
        });
      });
    });
  });

  describe('emptyResponse()', () => {
    describe('hasData', () => {
      it('should be false', () => {
        const { hasData } = emptyResponse;

        expect(hasData).toBe(false);
      });
    });

    describe('hasError', () => {
      it('should be false', () => {
        const { hasError } = emptyResponse;

        expect(hasError).toBe(false);
      });
    });

    describe('isErrored', () => {
      it('should be false', () => {
        const { isErrored } = emptyResponse;

        expect(isErrored).toBe(false);
      });
    });

    describe('isFailure', () => {
      it('should be false', () => {
        const { isFailure } = emptyResponse;

        expect(isFailure).toBe(false);
      });
    });

    describe('isLoading', () => {
      it('should be false', () => {
        const { isLoading } = emptyResponse;

        expect(isLoading).toBe(false);
      });
    });

    describe('isSuccess', () => {
      it('should be false', () => {
        const { isSuccess } = emptyResponse;

        expect(isSuccess).toBe(false);
      });
    });

    describe('isUninitialized', () => {
      it('should be false', () => {
        const { isUninitialized } = emptyResponse;

        expect(isUninitialized).toBe(false);
      });
    });

    describe('meta', () => {
      it('should be false', () => {
        const { meta } = emptyResponse;

        expect(meta).toEqual({});
      });
    });

    describe('status', () => {
      it('should be "unknown"', () => {
        const { status } = emptyResponse;

        expect(status).toBe("unknown");
      });
    });
  });

  describe('formatBody()', () => {
    it('should be a function', () => {
      expect(typeof formatBody).toBe('function');
    });

    describe('with undefined', () => {
      it('should return null', () => {
        expect(formatBody({ body: undefined })).toBeNull();
      });
    });

    describe('with null', () => {
      it('should return null', () => {
        expect(formatBody({ body: null })).toBeNull();
      });
    });

    describe('with an empty object', () => {
      it('should return null', () => {
        expect(formatBody({ body: {} })).toBeNull();
      });
    });

    describe('with an empty string', () => {
      it('should return null', () => {
        expect(formatBody({ body: '' })).toBeNull();
      });
    });

    describe('with a non-empty object', () => {
      const body = { greetings: 'programs' };
      const expected = JSON.stringify(body);

      it('should format the string', () => {
        expect(formatBody({ body })).toEqual(expected);
      });
    });

    describe('with a non-empty string', () => {
      const body = 'Greetings, programs!';

      it('should return the string', () => {
        expect(formatBody({ body })).toEqual(body);
      });
    });
  });

  describe('formatParams()', () => {
    it('should be a function', () => {
      expect(typeof formatParams).toBe('function');
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(formatParams(undefined)).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(formatParams(null)).toBe('');
      });
    });

    describe('with an empty object', () => {
      const params: RequestParams = {};

      it('should return an empty string', () => {
        expect(formatParams(params)).toBe('');
      });
    });

    describe('with a basic object', () => {
      const params: RequestParams = {
        ichi: 'one',
        ni: 'two',
        san: 'three',
      };
      const expected = '?ichi=one&ni=two&san=three';

      it('should format the params', () => {
        expect(formatParams(params)).toEqual(expected);
      });
    });

    describe('with an object with keys requiring encoding', () => {
      const params: RequestParams = {
        salutation: 'greetings programs',
      };
      const expected = '?salutation=greetings%20programs';

      it('should format the params', () => {
        expect(formatParams(params)).toEqual(expected);
      });
    });
  });

  describe('mapData()', () => {
    it('should be a function', () => {
      expect(typeof mapData).toBe('function');
    });

    describe('with undefined', () => {
      it('should return null', () => {
        expect(mapData(undefined)).toBeNull();
      });
    });

    describe('with null', () => {
      it('should return null', () => {
        expect(mapData(null)).toBeNull();
      });
    });

    describe('with an empty object', () => {
      it('should return null', () => {
        expect(mapData({})).toBeNull();
      });
    });

    describe('with a non-empty object', () => {
      const data = { greetings: 'programs' };

      it('should return the object', () => {
        expect(mapData(data)).toBe(data);
      });
    });

    describe('with an empty string', () => {
      it('should return null', () => {
        expect(mapData('')).toBeNull();
      });
    });

    describe('with a non-empty string', () => {
      const data = 'Greetings, programs!';

      it('should return the string', () => {
        expect(mapData(data)).toBe(data);
      });
    });
  });

  describe('withData()', () => {
    const successResponse: Response = {
      ...emptyResponse,
      isSuccess: true,
      status: 'success',
    };

    it('should be a function', () => {
      expect(typeof withData).toBe('function');
    });

    describe('with data: an object', () => {
      const data: ResponseData = { greetings: 'programs' };
      const expected: Response = {
        ...successResponse,
        data,
        hasData: true,
      };

      it('should return a response with data', () => {
        expect(withData({ data })).toEqual(expected);
      });
    });

    describe('with data: a string', () => {
      const data: ResponseData = 'Greetings, programs!';
      const expected: Response = {
        ...successResponse,
        data,
        hasData: true,
      };

      it('should return a response with data', () => {
        expect(withData({ data })).toEqual(expected);
      });
    });

    describe('with a response', () => {
      const response: Response = {
        ...emptyResponse,
        isLoading: true,
        status: 'loading',
      };

      describe('with data: an object', () => {
        const data: ResponseData = { greetings: 'programs' };
        const expected: Response = {
          ...response,
          data,
          hasData: true,
        };

        it('should return a response with data', () => {
          expect(withData({ data, response })).toEqual(expected);
        });
      });

      describe('with data: a string', () => {
        const data: ResponseData = 'Greetings, programs!';
        const expected: Response = {
          ...response,
          data,
          hasData: true,
        };

        it('should return a response with data', () => {
          expect(withData({ data, response })).toEqual(expected);
        });
      });
    });
  });

  describe('withError()', () => {
    const failureResponse: Response = {
      ...emptyResponse,
      isFailure: true,
      status: 'failure',
    };

    it('should be a function', () => {
      expect(typeof withError).toBe('function');
    });

    describe('with error: an object', () => {
      const error: ResponseData = { message: 'something went wrong' };
      const expected: Response = {
        ...failureResponse,
        error,
        hasError: true,
      };

      it('should return a response with the error', () => {
        expect(withError({ error })).toEqual(expected);
      });
    });

    describe('with error: a string', () => {
      const error: ResponseData = 'something went wrong';
      const expected: Response = {
        ...failureResponse,
        error,
        hasError: true,
      };

      it('should return a response with the error', () => {
        expect(withError({ error })).toEqual(expected);
      });
    });

    describe('with errorType: a string', () => {
      const error: ResponseData = { message: 'something went wrong' };
      const errorType = 'test.errorType';
      const expected: Response = {
        ...failureResponse,
        error,
        errorType,
        hasError: true,
      };

      it('should return a response with the error', () => {
        expect(withError({ error, errorType })).toEqual(expected);
      });
    });

    describe('with a response', () => {
      const response: Response = {
        ...emptyResponse,
        isLoading: true,
        status: 'loading',
      };

      describe('with error: an object', () => {
        const error: ResponseData = { message: 'something went wrong' };
        const expected: Response = {
          ...response,
          error,
          hasError: true,
        };

        it('should return a response with the error', () => {
          expect(withError({ error, response })).toEqual(expected);
        });
      });

      describe('with error: a string', () => {
        const error: ResponseData = 'something went wrong';
        const expected: Response = {
          ...response,
          error,
          hasError: true,
        };

        it('should return a response with the error', () => {
          expect(withError({ error, response })).toEqual(expected);
        });
      });

      describe('with errorType: a string', () => {
        const error: ResponseData = { message: 'something went wrong' };
        const errorType = 'test.errorType';
        const expected: Response = {
          ...response,
          error,
          errorType,
          hasError: true,
        };

        it('should return a response with the error', () => {
          expect(withError({ error, errorType, response })).toEqual(expected);
        });
      });
    });
  });

  describe('withStatus()', () => {
    it('should be a function', () => {
      expect(typeof withStatus).toBe('function');
    });

    describe('with status: errored', () => {
      const status = 'errored';
      const expected: Response = {
        ...emptyResponse,
        isErrored: true,
        status,
      };

      it('should return an errored response', () => {
        expect(withStatus({ status })).toEqual(expected);
      });
    });

    describe('with status: failure', () => {
      const status = 'failure';
      const expected: Response = {
        ...emptyResponse,
        isFailure: true,
        status,
      };

      it('should return a failure response', () => {
        expect(withStatus({ status })).toEqual(expected);
      });
    });

    describe('with status: loading', () => {
      const status = 'loading';
      const expected: Response = {
        ...emptyResponse,
        isLoading: true,
        status,
      };

      it('should return a loading response', () => {
        expect(withStatus({ status })).toEqual(expected);
      });
    });

    describe('with status: success', () => {
      const status = 'success';
      const expected: Response = {
        ...emptyResponse,
        isSuccess: true,
        status,
      };

      it('should return a success response', () => {
        expect(withStatus({ status })).toEqual(expected);
      });
    });

    describe('with status: uninitialized', () => {
      const status = 'uninitialized';
      const expected: Response = {
        ...emptyResponse,
        isUninitialized: true,
        status,
      };

      it('should return an uninitialized response', () => {
        expect(withStatus({ status })).toEqual(expected);
      });
    });

    describe('with a response', () => {
      const response: Response = {
        ...emptyResponse,
        data: { ok: true },
        hasData: true,
        isSuccess: true,
        status: 'success',
      };

      describe('with status: errored', () => {
        const status = 'errored';
        const expected: Response = {
          ...response,
          isErrored: true,
          isSuccess: false,
          status,
        };

        it('should return an errored response', () => {
          expect(withStatus({ response, status })).toEqual(expected);
        });
      });

      describe('with status: failure', () => {
        const status = 'failure';
        const expected: Response = {
          ...response,
          isFailure: true,
          isSuccess: false,
          status,
        };

        it('should return a failure response', () => {
          expect(withStatus({ response, status })).toEqual(expected);
        });
      });

      describe('with status: loading', () => {
        const status = 'loading';
        const expected: Response = {
          ...response,
          isLoading: true,
          isSuccess: false,
          status,
        };

        it('should return a loading response', () => {
          expect(withStatus({ response, status })).toEqual(expected);
        });
      });

      describe('with status: success', () => {
        const status = 'success'

        it('should return a success response', () => {
          expect(withStatus({ response, status })).toEqual(response);
        });
      });

      describe('with status: uninitialized', () => {
        const status = 'uninitialized';
        const expected: Response = {
          ...response,
          isSuccess: false,
          isUninitialized: true,
          status,
        };

        it('should return an uninitialized response', () => {
          expect(withStatus({ response, status })).toEqual(expected);
        });
      });
    });
  });
});
