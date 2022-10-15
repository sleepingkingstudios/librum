import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { faUserClock } from '@fortawesome/free-solid-svg-icons';

import { useMutationRequest } from './use-mutation-request';
import { useAlerts } from '@alerts';
import type {
  Alert,
  DisplayAlertProps,
} from '@alerts';
import { actions as sessionActions } from '@session';
import { useStoreDispatch } from '@store/hooks';
import { expiredSessionError } from '../errors';
import {
  defaultResult,
  defaultResponse,
} from '../test-helpers';
import type {
  ApiError,
  ApiFailure,
  ApiSuccess,
  Effect,
  UseMutation,
} from '../types';

jest.mock('@alerts');
jest.mock('@store/hooks');

const dismissAllAlerts = jest.fn();
const displayAlert = jest.fn();
const alerts = {
  alerts: [] as Alert[],
  dismissAlert: jest.fn(),
  dismissAllAlerts,
  displayAlert,
};
const dispatch = jest.fn();
const mockUseAlerts = useAlerts as jest.MockedFunction<typeof useAlerts>;
const mockUseStoreDispatch = useStoreDispatch as jest.MockedFunction<typeof useStoreDispatch>;

mockUseAlerts.mockImplementation(() => alerts);
mockUseStoreDispatch.mockImplementation(() => dispatch);

describe('API hooks useMutationRequest()', () => {
  const trigger = jest.fn();
  const useMutation = jest.fn(
    () => [trigger, defaultResult]
  ) as jest.MockedFunction<UseMutation>;

  beforeEach(() => {
    trigger.mockClear();

    useMutation.mockClear();
  });

  it('should be a function', () => {
    expect(typeof useMutationRequest).toBe('function');
  });

  it('should call the useMutation hook', () => {
    renderHook(() => useMutationRequest({ useMutation }));

    expect(useMutation).toHaveBeenCalled();
  });

  describe('when the mutation is uninitialized', () => {
    const mutationResult = {
      ...defaultResult,
      isUninitialized: true,
    };
    const response = {
      ...defaultResponse,
      isUninitialized: true,
      status: 'uninitialized',
    };

    beforeEach(() => {
      useMutation.mockImplementation(() => [trigger, mutationResult]);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useMutationRequest({ useMutation }));
      const { current } = result;

      expect(current).toEqual([trigger, response]);
    });
  });

  describe('when the mutation is loading', () => {
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
      useMutation.mockImplementation(() => [trigger, loadingResult]);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useMutationRequest({ useMutation }));
      const { current } = result;

      expect(current).toEqual([trigger, response]);
    });
  });

  describe('when the mutation is errored', () => {
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
      useMutation.mockImplementation(() => [trigger, erroredResult]);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useMutationRequest({ useMutation }));
      const { current } = result;

      expect(current).toEqual([trigger, response]);
    });
  });

  describe('when the mutation returns a failure response', () => {
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
      useMutation.mockImplementation(() => [trigger, failureResult]);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useMutationRequest({ useMutation }));
      const { current } = result;

      expect(current).toEqual([trigger, response]);
    });
  });

  describe('when the mutation returns a failure response with data', () => {
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
      useMutation.mockImplementation(() => [trigger, failureResult]);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useMutationRequest({ useMutation }));
      const { current } = result;

      expect(current).toEqual([trigger, response]);
    });
  });

  describe('when the mutation returns a failure response with an expired session error', () => {
    const error: ApiError = {
      data: {},
      message: 'The auth session has expired',
      type: expiredSessionError,
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
    const expectedAlert: DisplayAlertProps = {
      context: 'authentication:session',
      icon: faUserClock,
      message: 'Your login session has expired',
      type: 'warning',
    };

    beforeEach(() => {
      useMutation.mockImplementation(() => [trigger, failureResult]);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useMutationRequest({ useMutation }));
      const { current } = result;

      expect(current).toEqual([trigger, response]);
    });

    it('should clear the session', () => {
      renderHook(() => useMutationRequest({ useMutation }));

      expect(dispatch).toHaveBeenCalledWith(sessionActions.destroy());
    });

    it('should clear the stored session', () => {
      localStorage.setItem('session', JSON.stringify({ authenticated: false }));

      renderHook(() => useMutationRequest({ useMutation }));

      expect(localStorage.getItem('session')).toBeNull();
    });

    it('should display an alert', () => {
      renderHook(() => useMutationRequest({ useMutation }));

      expect(displayAlert).toHaveBeenCalledWith(expectedAlert);
    });
  });

  describe('when the mutation returns a success response', () => {
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
      useMutation.mockImplementation(() => [trigger, successResult]);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useMutationRequest({ useMutation }));
      const { current } = result;

      expect(current).toEqual([trigger, response]);
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
    const expectedOptions = {
      alerts,
      dispatch,
    };

    beforeEach(() => {
      useMutation.mockImplementation(() => [trigger, successResult]);

      displayAlerts.mockClear();
      logResponse.mockClear();
    });

    it('should call the useMutation hook', () => {
      renderHook(() => useMutationRequest({ effects, useMutation }));

      expect(useMutation).toHaveBeenCalled();
    });

    it('should call the effects', () => {
      renderHook(() => useMutationRequest({ effects, useMutation }));

      expect(displayAlerts).toHaveBeenCalledWith(response, expectedOptions);
      expect(logResponse).toHaveBeenCalledWith(response, expectedOptions);
    });
  });

  describe('with effects: array and options: object', () => {
    const injectedFunction = jest.fn();
    const options: Record<string, unknown> = { injectedFunction };
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
    const expectedOptions = {
      alerts,
      dispatch,
      injectedFunction,
    };

    beforeEach(() => {
      useMutation.mockImplementation(() => [trigger, successResult]);

      displayAlerts.mockClear();
      logResponse.mockClear();
    });

    it('should call the useMutation hook', () => {
      renderHook(() => useMutationRequest({ effects, options, useMutation }));

      expect(useMutation).toHaveBeenCalled();
    });

    it('should call the effects', () => {
      renderHook(() => useMutationRequest({ effects, options, useMutation }));

      expect(displayAlerts).toHaveBeenCalledWith(response, expectedOptions);
      expect(logResponse).toHaveBeenCalledWith(response, expectedOptions);
    });
  });
});
