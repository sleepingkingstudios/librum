import {
  apiDataMiddleware,
  convertOptionsToSnakeCase,
  convertResponseToCamelCase,
  extractData,
  extractError,
} from './api-data';
import { convertToCamelCase } from '@utils/data';
import type { DataObject } from '@utils/types';
import type {
  ApiError,
  HttpMethod,
  PerformRequest,
  RequestOptions,
  Response,
} from '../types';
import {
  withData,
  withError,
  withStatus,
} from '../utils';

describe('API request middleware', () => {
  describe('apiDataMiddleware()', () => {
    const url = 'www.example.com';
    const options: RequestOptions = {};
    const response: Response = withStatus({ status: 'success' });
    const performRequest: jest.MockedFunction<PerformRequest> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (url, options) => new Promise(resolve => resolve(response)),
    );

    beforeEach(() => { performRequest.mockClear(); });

    it('should be a function', () => {
      expect(typeof apiDataMiddleware).toBe('function');
    });

    it('should return a function', () => {
      const applied = apiDataMiddleware(performRequest, {});

      expect(typeof applied).toBe('function');
    });

    it('should perform the request', async () => {
      const applied = apiDataMiddleware(performRequest, {});

      await applied(url, options);

      expect(performRequest).toHaveBeenCalledWith(url, options);
    });

    it('should return the response', async () => {
      const expected = withStatus({ status: 'success' });
      const applied = apiDataMiddleware(performRequest, {});
      const response = await applied(url, options);

      expect(response).toEqual(expected);
    });

    describe('when the response has api data', () => {
      const data = {
        current_user: {
          first_name: 'Alan',
          last_name: 'Bradley',
        },
      };
      const formatted = convertToCamelCase(data) as DataObject;
      const response: Response = withStatus({
        response: withData({ data: { ok: true, data } }),
        status: 'success',
      });
      const expected: Response = withStatus({
        response: withData({ data: formatted }),
        status: 'success',
      });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(response)),
        );
      });

      it('should format the response data', async () => {
        const applied = apiDataMiddleware(performRequest, {});
        const response = await applied(url, options);

        expect(response).toEqual(expected);
      });
    });

    describe('when the response has an api error', () => {
      const error: ApiError = {
        data: { code: 'ID10T' },
        message: 'Something went wrong',
        type: 'test.error_type',
      };
      const formatted: ApiError = {
        data: { code: 'ID10T' },
        message: 'Something went wrong',
        type: 'test.errorType',
      };
      const response = withStatus({
        response: withData({
          data: { ok: false, error },
        }),
        status: 'failure',
      });
      const expected = withStatus({
        response: withError({ error: formatted, errorType: formatted.type }),
        status: 'failure',
      });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(response)),
        );
      });

      it('should format the response data', async () => {
        const applied = apiDataMiddleware(performRequest, {});
        const response = await applied(url, options);

        expect(response).toEqual(expected);
      });
    });

    describe('with request options', () => {
      const options = {
        body: {
          currentUser: {
            firstName: 'Alan',
            lastName: 'Bradley',
          },
        },
        method: 'post' as HttpMethod,
        params: {
          sortDirection: 'ascending',
        },
      };
      const expectedOptions = {
        body: {
          current_user: {
            first_name: 'Alan',
            last_name: 'Bradley',
          },
        },
        method: 'post',
        params: {
          sort_direction: 'ascending',
        },
      };

      it('should format the request options', async () => {
        const applied = apiDataMiddleware(performRequest, {});

        await applied(url, options);

        expect(performRequest).toHaveBeenCalledWith(url, expectedOptions);
      });
    });
  });

  describe('convertOptionsToSnakeCase()', () => {
    const optionalValues: RequestOptions = {
      contentType: 'json',
      headers: { 'X-Custom-Header': 'value' },
      method: 'put',
      wildcards: { id: 'on-war' },
    };

    it('should be a function', () => {
      expect(typeof convertOptionsToSnakeCase).toBe('function');
    });

    describe('with undefined', () => {
      it('should return an empty object', () => {
        expect(convertOptionsToSnakeCase(undefined)).toEqual({});
      });
    });

    describe('with null', () => {
      it('should return an empty object', () => {
        expect(convertOptionsToSnakeCase(null)).toEqual({});
      });
    });

    describe('with an empty object', () => {
      it('should return an empty object', () => {
        expect(convertOptionsToSnakeCase({})).toEqual({});
      });
    });

    describe('with options', () => {
      const options: RequestOptions = optionalValues;

      it('should return the options', () => {
        expect(convertOptionsToSnakeCase(options)).toEqual(options);
      });
    });

    describe('with body: an empty string', () => {
      const options: RequestOptions = {
        body: '',
        ...optionalValues,
      };

      it('should return the options', () => {
        expect(convertOptionsToSnakeCase(options)).toEqual(options);
      });
    });

    describe('with body: a non-empty string', () => {
      const options: RequestOptions = {
        body: 'Greetings, starfighter!',
        ...optionalValues
      };

      it('should return the options', () => {
        expect(convertOptionsToSnakeCase(options)).toEqual(options);
      });
    });

    describe('with body: an empty object', () => {
      const options: RequestOptions = {
        body: {},
        ...optionalValues,
      };

      it('should return the options', () => {
        expect(convertOptionsToSnakeCase(options)).toEqual(options);
      });
    });

    describe('with body: a non-empty object', () => {
      const options: RequestOptions = {
        body: {
          currentUser: {
            firstName: 'Alan',
            lastName: 'Bradley',
          },
        },
        ...optionalValues,
      };
      const expected: RequestOptions = {
        body: {
          current_user: {
            first_name: 'Alan',
            last_name: 'Bradley',
          },
        },
        ...optionalValues,
      };

      it('should convert the body keys to snake_case', () => {
        expect(convertOptionsToSnakeCase(options)).toEqual(expected);
      });
    });

    describe('with params: an empty object', () => {
      const options: RequestOptions = {
        params: {},
        ...optionalValues,
      };

      it('should return the options', () => {
        expect(convertOptionsToSnakeCase(options)).toEqual(options);
      });
    });

    describe('with params: a non-empty object', () => {
      const options: RequestOptions = {
        params: { sortDirection: 'ascending' },
        ...optionalValues,
      };
      const expected: RequestOptions = {
        params: { sort_direction: 'ascending' },
        ...optionalValues,
      };

      it('should convert the params keys to snake_case', () => {
        expect(convertOptionsToSnakeCase(options)).toEqual(expected);
      });
    });
  });

  describe('convertResponseToCamelCase()', () => {
    it('should be a function', () => {
      expect(typeof convertResponseToCamelCase).toBe('function');
    });

    describe('with a failing response', () => {
      const response = withStatus({ status: 'failure' });

      it('should return the response', () => {
        expect(convertResponseToCamelCase(response)).toEqual(response);
      });
    });

    describe('with a failing response with an error', () => {
      const formatted: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: 'client.error',
      };
      const response = withStatus({
        response: withError({
          error: 'Something went wrong',
        }),
        status: 'failure',
      });
      const expected = withStatus({
        response: withError({ error: formatted, errorType: formatted.type }),
        status: 'failure',
      });

      it('should return the response', () => {
        expect(convertResponseToCamelCase(response)).toEqual(expected);
      });
    });

    describe('with a failing response with api data', () => {
      const data = { current_user: 'Alan Bradley' };
      const formatted = { currentUser: 'Alan Bradley' };
      const response = withStatus({
        response: withData({
          data: { ok: false, data },
        }),
        status: 'failure',
      });
      const expected = withStatus({
        response: withData({
          data: formatted,
        }),
        status: 'failure',
      });

      it('should format the response', () => {
        expect(convertResponseToCamelCase(response)).toEqual(expected);
      });
    });

    describe('with a failing response with an api error', () => {
      const error: ApiError = {
        data: { code: 'ID10T' },
        message: 'Something went wrong',
        type: 'test.error_type',
      };
      const formatted: ApiError = {
        data: { code: 'ID10T' },
        message: 'Something went wrong',
        type: 'test.errorType',
      };
      const response = withStatus({
        response: withData({
          data: { ok: false, error },
        }),
        status: 'failure',
      });
      const expected = withStatus({
        response: withError({ error: formatted, errorType: formatted.type }),
        status: 'failure',
      });

      it('should format the response', () => {
        expect(convertResponseToCamelCase(response)).toEqual(expected);
      });
    });

    describe('with a failing response with api data and an api error', () => {
      const data = { current_user: 'Alan Bradley' };
      const formattedData = { currentUser: 'Alan Bradley' };
      const error: ApiError = {
        data: { code: 'ID10T' },
        message: 'Something went wrong',
        type: 'test.error_type',
      };
      const formattedError: ApiError = {
        data: { code: 'ID10T' },
        message: 'Something went wrong',
        type: 'test.errorType',
      };
      const response = withStatus({
        response: withData({
          data: { ok: false, data, error }
        }),
        status: 'failure',
      });
      const expected = withStatus({
        response: withData({
          data: formattedData,
          response: withError({
            error: formattedError,
            errorType: formattedError.type,
          }),
        }),
        status: 'failure',
      });

      it('should format the response', () => {
        expect(convertResponseToCamelCase(response)).toEqual(expected);
      });
    });

    describe('with a passing response', () => {
      const response = withStatus({ status: 'success' });

      it('should return the response', () => {
        expect(convertResponseToCamelCase(response)).toEqual(response);
      });
    });

    describe('with a passing response with api data', () => {
      const data = { current_user: 'Alan Bradley' };
      const formatted = { currentUser: 'Alan Bradley' };
      const response = withStatus({
        response: withData({
          data: { ok: true, data },
        }),
        status: 'success',
      });
      const expected = withStatus({
        response: withData({
          data: formatted,
        }),
        status: 'success',
      });

      it('should format the response', () => {
        expect(convertResponseToCamelCase(response)).toEqual(expected);
      });
    });
  });

  describe('extractData()', () => {
    it('should be a function', () => {
      expect(typeof extractData).toBe('function');
    });

    describe('with undefined', () => {
      it('should return null', () => {
        expect(extractData(undefined)).toBeNull();
      });
    });

    describe('with null', () => {
      it('should return null', () => {
        expect(extractData(null)).toBeNull();
      });
    });

    describe('with an empty string', () => {
      it('should return null', () => {
        expect(extractData('')).toBeNull();
      });
    });

    describe('with a non-empty string', () => {
      const data = 'Greetings, starfighter!';

      it('should wrap the string', () => {
        expect(extractData(data)).toEqual({ data });
      });
    });

    describe('with an empty object', () => {
      it('should return null', () => {
        expect(extractData({})).toBeNull();
      });
    });

    describe('with an object without a "data" key', () => {
      const data = { ok: true };

      it('should return null', () => {
        expect(extractData(data)).toBeNull();
      });
    });

    describe('with an object with a malformed "data" key', () => {
      const data = { ok: true, data: false };

      it('should wrap the data object', () => {
        expect(extractData(data)).toEqual({ data: false });
      });
    });

    describe('with an object with a valid "data" key', () => {
      const data = {
        ok: true,
        data: {
          first_name: 'Alan',
          last_name: 'Bradley',
        },
      };
      const expected = {
        firstName: 'Alan',
        lastName: 'Bradley',
      };

      it('should wrap the data object', () => {
        expect(extractData(data)).toEqual(expected);
      });
    });
  });

  describe('extractError()', () => {
    it('should be a function', () => {
      expect(typeof extractError).toBe('function');
    });

    describe('with data: undefined', () => {
      it('should return null', () => {
        expect(extractError(undefined, undefined)).toBeNull();
      });
    });

    describe('with data: null', () => {
      it('should return null', () => {
        expect(extractError(null, undefined)).toBeNull();
      });
    });

    describe('with data: an empty string', () => {
      it('should return null', () => {
        expect(extractError('', undefined)).toBeNull();
      });
    });

    describe('with data: a non-empty string', () => {
      const data = 'Greetings, starfighter!';

      it('should return null', () => {
        expect(extractError(data, undefined)).toBeNull();
      });
    });

    describe('with data: an empty object', () => {
      it('should return null', () => {
        expect(extractError({}, undefined)).toBeNull();
      });
    });

    describe('with data: an object without an "error" key', () => {
      const data = { ok: false };

      it('should return null', () => {
        expect(extractError(data, undefined)).toBeNull();
      });
    });

    describe('with data: an object with a malformed "error" key', () => {
      const data = { ok: true, error: 'Something went wrong' };

      it('should wrap the error', () => {
        const expected = {
          data: { error: data.error },
          message: 'Unknown error',
          type: 'client.error',
        };

        expect(extractError(data, undefined)).toEqual(expected);
      });
    });

    describe('with data: an object with a partial "error" key', () => {
      const data = { ok: true, error: { message: 'Something went wrong' } };

      it('should wrap the error', () => {
        const expected = {
          data: { error: data.error },
          message: 'Unknown error',
          type: 'client.error',
        };

        expect(extractError(data, undefined)).toEqual(expected);
      });
    });

    describe('with data: an object with a valid "error" key', () => {
      const error = {
        data: {},
        message: 'Something went wrong',
        type: 'test.custom_error',
      };
      const data = { ok: false, error };
      const expected = {
        ...error,
        type: 'test.customError',
      };

      it('should return the error', () => {
        expect(extractError(data, undefined)).toEqual(expected);
      });
    });

    describe('with data: an object with a valid "error" key and data', () => {
      const error = {
        data: {
          error_code: 'ID10T',
        },
        message: 'Something went wrong',
        type: 'test.custom_error',
      };
      const data = { ok: false, error };
      const expected = {
        ...error,
        data: {
          errorCode: 'ID10T',
        },
        type: 'test.customError',
      };

      it('should return the error', () => {
        expect(extractError(data, undefined)).toEqual(expected);
      });
    });

    describe('with err: null', () => {
      it('should return null', () => {
        expect(extractError(undefined, null)).toBeNull();
      });

      describe('with data: a valid error', () => {
        const error = {
          data: {},
          message: 'Something went wrong',
          type: 'test.custom_error',
        };
        const data = { ok: false, error };
        const expected = {
          ...error,
          type: 'test.customError',
        };

        it('should return the error', () => {
          expect(extractError(data, null)).toEqual(expected);
        });
      });
    });

    describe('with err: an empty string', () => {
      it('should return null', () => {
        expect(extractError(undefined, '')).toBeNull();
      });

      describe('with data: a valid error', () => {
        const error = {
          data: {},
          message: 'Something went wrong',
          type: 'test.custom_error',
        };
        const data = { ok: false, error };
        const expected = {
          ...error,
          type: 'test.customError',
        };

        it('should return the error', () => {
          expect(extractError(data, '')).toEqual(expected);
        });
      });
    });

    describe('with err: a non-empty string', () => {
      const err = 'Something went wrong';
      const expected = {
        data: {},
        message: err,
        type: 'client.error',
      };

      it('should wrap the error', () => {
        expect(extractError(undefined, err)).toEqual(expected);
      });

      describe('with data: a valid error', () => {
        const error = {
          data: {},
          message: 'Something went wrong',
          type: 'test.custom_error',
        };
        const data = { ok: false, error };

        it('should wrap the error', () => {
          expect(extractError(data, err)).toEqual(expected);
        });
      });
    });

    describe('with err: an empty object', () => {
      it('should return null', () => {
        expect(extractError(undefined, {})).toBeNull();
      });

      describe('with data: a valid error', () => {
        const error = {
          data: {},
          message: 'Something went wrong',
          type: 'test.custom_error',
        };
        const data = { ok: false, error };
        const expected = {
          ...error,
          type: 'test.customError',
        };

        it('should return the error', () => {
          expect(extractError(data, {})).toEqual(expected);
        });
      });
    });

    describe('with err: a non-empty object', () => {
      const err = { message: 'Something went wrong' };
      const expected = {
        data: err,
        message: 'Unknown error',
        type: 'client.error',
      };

      it('should wrap the error', () => {
        expect(extractError(undefined, err)).toEqual(expected);
      });

      describe('with data: a valid error', () => {
        const error = {
          data: {},
          message: 'Something went wrong',
          type: 'test.custom_error',
        };
        const data = { ok: false, error };

        it('should wrap the error', () => {
          expect(extractError(data, err)).toEqual(expected);
        });
      });
    });
  });
});
