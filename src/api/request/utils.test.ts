import {
  emptyResponse,
  formatBody,
  formatParams,
  mapData,
  withData,
  withError,
  withStatus,
} from './utils';
import type {
  RequestParams,
  Response,
  ResponseData,
} from './types';

describe('API response utils', () => {
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
    it('should be a function', () => {
      expect(typeof withData).toBe('function');
    });

    describe('with data: an object', () => {
      const data: ResponseData = { greetings: 'programs' };
      const expected: Response = {
        ...emptyResponse,
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
        ...emptyResponse,
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
        isSuccess: true,
        status: 'success',
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
    it('should be a function', () => {
      expect(typeof withError).toBe('function');
    });

    describe('with error: an object', () => {
      const error: ResponseData = { message: 'something went wrong' };
      const expected: Response = {
        ...emptyResponse,
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
        ...emptyResponse,
        error,
        hasError: true,
      };

      it('should return a response with the error', () => {
        expect(withError({ error })).toEqual(expected);
      });
    });

    describe('with a response', () => {
      const response: Response = {
        ...emptyResponse,
        isSuccess: true,
        status: 'success',
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
