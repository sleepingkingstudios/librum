import {
  convertToCamelCase,
  convertToSnakeCase,
  getData,
  getError,
  hasData,
  hasError,
  isFailure,
  isSuccess,
  responseMatches,
} from './utils';
import type { DataObject } from '@utils/types';
import {
  buildFailureResponse,
  buildSuccessResponse,
  fetchErrorResponse,
  serializedErrorResponse,
} from './test-helpers';
import type {
  ApiError,
  FetchFailure,
  FetchResponse,
  FetchSuccess,
} from './types';

const apiData: DataObject = {
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
  describe('convertToCamelCase', () => {
    it('should be a function', () => {
      expect(typeof convertToCamelCase).toBe('function');
    });

    describe('with null', () => {
      it('should return the value', () => {
        expect(convertToCamelCase(null)).toBeNull();
      });
    });

    describe('with false', () => {
      it('should return the value', () => {
        expect(convertToCamelCase(false)).toBe(false);
      });
    });

    describe('with true', () => {
      it('should return the value', () => {
        expect(convertToCamelCase(true)).toBe(true);
      });
    });

    describe('with a number', () => {
      const data = 1.0;

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with a string', () => {
      const data = 'Greetings, programs!';

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an empty array', () => {
      const data: unknown[] = [];

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an array of literals', () => {
      const data: unknown[] = [null, false, 'ok'];

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an array of arrays', () => {
      const data: unknown[] = [['ichi', 1], ['ni', 2], ['san', 3]];

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an array of objects', () => {
      const data: DataObject = [
        { user_name: 'Alan Bradley' },
        { user_name: 'Kevin Flynn' },
        { user_name: 'Ed Dillinger' },
      ];
      const expected: DataObject = [
        { userName: 'Alan Bradley' },
        { userName: 'Kevin Flynn' },
        { userName: 'Ed Dillinger' },
      ];

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });

    describe('with an empty object', () => {
      const data: DataObject = {};

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an object with camelCase keys', () => {
      const data: DataObject = {
        firstName: 'Alan',
        lastName: 'Bradley',
      };

      it('should return the value', () => {
        expect(convertToCamelCase(data)).toEqual(data);
      });
    });

    describe('with an object with snake_case keys', () => {
      const data: DataObject = {
        first_name: 'Alan',
        last_name: 'Bradley',
      };
      const expected: DataObject = {
        firstName: 'Alan',
        lastName: 'Bradley',
      };

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });

    describe('with an object with nested objects', () => {
      const data: DataObject = {
        current_user: {
          first_name: 'Alan',
          last_name: 'Bradley',
        },
      };
      const expected: DataObject = {
        currentUser: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });

    describe('with a complex object', () => {
      const data: DataObject = {
        authorized_users: [
          { user_name: 'Alan Bradley' },
          { user_name: 'Kevin Flynn' },
          { user_name: 'Ed Dillinger' },
        ],
      };
      const expected: DataObject = {
        authorizedUsers: [
          { userName: 'Alan Bradley' },
          { userName: 'Kevin Flynn' },
          { userName: 'Ed Dillinger' },
        ],
      };

      it('should convert the keys to camelCase', () => {
        expect(convertToCamelCase(data)).toEqual(expected);
      });
    });
  });

  describe('convertToSnakeCase', () => {
    it('should be a function', () => {
      expect(typeof convertToSnakeCase).toBe('function');
    });

    describe('with null', () => {
      it('should return the value', () => {
        expect(convertToSnakeCase(null)).toBeNull();
      });
    });

    describe('with false', () => {
      it('should return the value', () => {
        expect(convertToSnakeCase(false)).toBe(false);
      });
    });

    describe('with true', () => {
      it('should return the value', () => {
        expect(convertToSnakeCase(true)).toBe(true);
      });
    });

    describe('with a number', () => {
      const data = 1.0;

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with a string', () => {
      const data = 'Greetings, programs!';

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an empty array', () => {
      const data: unknown[] = [];

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an array of literals', () => {
      const data: unknown[] = [null, false, 'ok'];

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an array of arrays', () => {
      const data: unknown[] = [['ichi', 1], ['ni', 2], ['san', 3]];

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an array of objects', () => {
      const data: DataObject = [
        { userName: 'Alan Bradley' },
        { userName: 'Kevin Flynn' },
        { userName: 'Ed Dillinger' },
      ];
      const expected: DataObject = [
        { user_name: 'Alan Bradley' },
        { user_name: 'Kevin Flynn' },
        { user_name: 'Ed Dillinger' },
      ];

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });

    describe('with an empty object', () => {
      const data: DataObject = {};

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an object with camelCase keys', () => {
      const data: DataObject = {
        firstName: 'Alan',
        lastName: 'Bradley',
      };
      const expected: DataObject = {
        first_name: 'Alan',
        last_name: 'Bradley',
      };

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });

    describe('with an object with snake_case keys', () => {
      const data: DataObject = {
        first_name: 'Alan',
        last_name: 'Bradley',
      };

      it('should return the value', () => {
        expect(convertToSnakeCase(data)).toEqual(data);
      });
    });

    describe('with an object with nested objects', () => {
      const data: DataObject = {
        currentUser: {
          firstName: 'Alan',
          lastName: 'Bradley',
        },
      };
      const expected: DataObject = {
        current_user: {
          first_name: 'Alan',
          last_name: 'Bradley',
        },
      };

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });

    describe('with a complex object', () => {
      const data: DataObject = {
        authorizedUsers: [
          { userName: 'Alan Bradley' },
          { userName: 'Kevin Flynn' },
          { userName: 'Ed Dillinger' },
        ],
      };
      const expected: DataObject = {
        authorized_users: [
          { user_name: 'Alan Bradley' },
          { user_name: 'Kevin Flynn' },
          { user_name: 'Ed Dillinger' },
        ],
      };

      it('should convert the keys to snake_case', () => {
        expect(convertToSnakeCase(data)).toEqual(expected);
      });
    });
  });

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
