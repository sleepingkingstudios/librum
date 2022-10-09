import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useQueryRequest } from './use-query-request';
import {
  ApiError,
  ApiFailure,
  ApiSuccess,
} from '../types';
import type {
  Effect,
  EffectOptions,
  Response,
} from './types';

describe('API hooks useQueryRequest()', () => {
  const defaultResult = {
    isUninitialized: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
  };
  const defaultResponse: Response = {
    hasData: false,
    hasError: false,
    isErrored: false,
    isFailure: false,
    isLoading: false,
    isSuccess: false,
    isUninitialized: false,
    status: 'unknown',
  };
  const useQuery = jest.fn(() => defaultResult);

  beforeEach(() => { useQuery.mockClear(); });

  it('should be a function', () => {
    expect(typeof useQueryRequest).toBe('function');
  });

  it('should call the useQuery hook', () => {
    renderHook(() => useQueryRequest({ useQuery }));

    expect(useQuery).toHaveBeenCalled();
  });

  describe('when the query is uninitialized', () => {
    const queryResult = {
      ...defaultResult,
      isUninitialized: true,
    };
    const response = {
      ...defaultResponse,
      isUninitialized: true,
      status: 'uninitialized',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => queryResult);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useQueryRequest({ useQuery }));
      const { current } = result;

      expect(current).toEqual(response);
    });
  });

  describe('when the query is loading', () => {
    const loadingResult = {
      ...defaultResult,
      isLoading: true,
    };
    const response = {
      ...defaultResponse,
      isLoading: true,
      status: 'loading',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => loadingResult);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useQueryRequest({ useQuery }));
      const { current } = result;

      expect(current).toEqual(response);
    });
  });

  describe('when the query is errored', () => {
    const erroredResult = {
      ...defaultResult,
      isError: true,
    };
    const response = {
      ...defaultResponse,
      isErrored: true,
      status: 'errored',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => erroredResult);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useQueryRequest({ useQuery }));
      const { current } = result;

      expect(current).toEqual(response);
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
    const response = {
      ...defaultResponse,
      error,
      errorType: error.type,
      hasError: true,
      isFailure: true,
      status: 'failure',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => failureResult);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useQueryRequest({ useQuery }));
      const { current } = result;

      expect(current).toEqual(response);
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
    const response = {
      ...defaultResponse,
      data,
      error,
      errorType: error.type,
      hasData: true,
      hasError: true,
      isFailure: true,
      status: 'failure',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => failureResult);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useQueryRequest({ useQuery }));
      const { current } = result;

      expect(current).toEqual(response);
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
    const response = {
      ...defaultResponse,
      data,
      hasData: true,
      isSuccess: true,
      status: 'success',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => successResult);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useQueryRequest({ useQuery }));
      const { current } = result;

      expect(current).toEqual(response);
    });
  });

  describe('with arg: value', () => {
    const arg = {
      perPage: 20,
      pageNumber: 5,
    };

    it('should call the useQuery hook', () => {
      renderHook(() => useQueryRequest({ arg, useQuery }));

      expect(useQuery).toHaveBeenCalledWith(arg);
    });
  });

  describe('with effects: array', () => {
    const logResponse: jest.MockedFunction<Effect> = jest.fn();
    const displayAlerts: jest.MockedFunction<Effect> = jest.fn();
    const effects: Effect[] = [
      displayAlerts,
      logResponse,
    ];
    const successResult = {
      ...defaultResult,
      isSuccess: true,
    };
    const response = {
      ...defaultResponse,
      isSuccess: true,
      status: 'success',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => successResult);

      displayAlerts.mockClear();
      logResponse.mockClear();
    });

    it('should call the useQuery hook', () => {
      renderHook(() => useQueryRequest({ effects, useQuery }));

      expect(useQuery).toHaveBeenCalled();
    });

    it('should call the effects', () => {
      renderHook(() => useQueryRequest({ effects, useQuery }));

      expect(displayAlerts).toHaveBeenCalledWith(response, {});
      expect(logResponse).toHaveBeenCalledWith(response, {});
    });
  });

  describe('with effects: array and options: object', () => {
    const displayAlert = jest.fn();
    const options: EffectOptions = { displayAlert };
    const logResponse: jest.MockedFunction<Effect> = jest.fn();
    const displayAlerts: jest.MockedFunction<Effect> = jest.fn();
    const effects: Effect[] = [
      displayAlerts,
      logResponse,
    ];
    const successResult = {
      ...defaultResult,
      isSuccess: true,
    };
    const response = {
      ...defaultResponse,
      isSuccess: true,
      status: 'success',
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => successResult);

      displayAlerts.mockClear();
      logResponse.mockClear();
    });

    it('should call the useQuery hook', () => {
      renderHook(() => useQueryRequest({ effects, options, useQuery }));

      expect(useQuery).toHaveBeenCalled();
    });

    it('should call the effects', () => {
      renderHook(() => useQueryRequest({ effects, options, useQuery }));

      expect(displayAlerts).toHaveBeenCalledWith(response, options);
      expect(logResponse).toHaveBeenCalledWith(response, options);
    });
  });
});
