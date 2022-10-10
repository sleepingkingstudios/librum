import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { faUserClock } from '@fortawesome/free-solid-svg-icons';

import { useQueryRequest } from './use-query-request';
import { useAlerts } from '@alerts';
import type {
  Alert,
  DisplayAlertProps,
} from '@alerts';
import { actions as sessionActions } from '@session';
import { useStoreDispatch } from '@store/hooks';
import { expiredSessionError } from '../errors';
import type {
  ApiError,
  ApiFailure,
  ApiSuccess,
  Effect,
} from '../types';
import type { Response } from './types';

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

describe('API hooks useQueryRequest()', () => {
  const refetch = jest.fn();
  const defaultResult = {
    isUninitialized: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    refetch,
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

  beforeEach(() => {
    refetch.mockClear();

    useQuery.mockClear();
  });

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

  describe('when the query returns a failure response with an expired session error', () => {
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
      useQuery.mockImplementation(() => failureResult);
    });

    it('should return the response properties', () => {
      const { result } = renderHook(() => useQueryRequest({ useQuery }));
      const { current } = result;

      expect(current).toEqual(response);
    });

    it('should refetch the query', () => {
      renderHook(() => useQueryRequest({ useQuery }));

      expect(refetch).toHaveBeenCalled();
    });

    describe('when the component has previously loaded', () => {
      const loadingResult = {
        ...defaultResult,
        isLoading: true,
      };

      beforeEach(() => {
        useQuery.mockImplementation(() => loadingResult);
      });

      it('should clear the session', () => {
        const { rerender } = renderHook(() => useQueryRequest({ useQuery }));

        useQuery.mockImplementation(() => failureResult);

        rerender();

        expect(dispatch).toHaveBeenCalledWith(sessionActions.destroy());
      });

      it('should clear the stored session', () => {
        localStorage.setItem('session', JSON.stringify({ authenticated: false }));

        const { rerender } = renderHook(() => useQueryRequest({ useQuery }));

        useQuery.mockImplementation(() => failureResult);

        rerender();

        expect(localStorage.getItem('session')).toBeNull();
      });

      it('should display an alert', () => {
        const { rerender } = renderHook(() => useQueryRequest({ useQuery }));

        useQuery.mockImplementation(() => failureResult);

        rerender();

        expect(displayAlert).toHaveBeenCalledWith(expectedAlert);
      });
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
    const expectedOptions = {
      alerts,
      dispatch,
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

      expect(displayAlerts).toHaveBeenCalledWith(response, expectedOptions);
      expect(logResponse).toHaveBeenCalledWith(response, expectedOptions);
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
      const failureResponse = {
        ...defaultResponse,
        error,
        errorType: 'spec.errors.genericError',
        hasError: true,
        isFailure: true,
        status: 'failure',
      };

      beforeEach(() => {
        useQuery.mockImplementation(() => failureResult);
      });

      it('should not call the effects', () => {
        renderHook(() => useQueryRequest({ effects, useQuery }));

        expect(displayAlerts).not.toHaveBeenCalled();
        expect(logResponse).not.toHaveBeenCalled();
      });

      describe('when the component has previously loaded', () => {
        const loadingResult = {
          ...defaultResult,
          isLoading: true,
        };

        beforeEach(() => {
          useQuery.mockImplementation(() => loadingResult);
        });

        it('should call the effects', () => {
          const { rerender } = renderHook(
            ({
              configuredEffects,
            }: {
              configuredEffects: Effect[],
            }) => useQueryRequest({ effects: configuredEffects, useQuery }),
            { initialProps: { configuredEffects: [] }}
          );

          useQuery.mockImplementation(() => failureResult);

          rerender({ configuredEffects: effects });

          expect(displayAlerts).toHaveBeenCalledWith(failureResponse, expectedOptions);
          expect(logResponse).toHaveBeenCalledWith(failureResponse, expectedOptions);
        });
      });
    });

    describe('when the query returns a failure response with an expired session error', () => {
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

      beforeEach(() => {
        useQuery.mockImplementation(() => failureResult);
      });

      it('should not call the effects', () => {
        renderHook(() => useQueryRequest({ effects, useQuery }));

        expect(displayAlerts).not.toHaveBeenCalled();
        expect(logResponse).not.toHaveBeenCalled();
      });

      describe('when the component has previously loaded', () => {
        const loadingResult = {
          ...defaultResult,
          isLoading: true,
        };

        beforeEach(() => {
          useQuery.mockImplementation(() => loadingResult);
        });

        it('should not call the effects', () => {
          const { rerender } = renderHook(
            ({
              configuredEffects,
            }: {
              configuredEffects: Effect[],
            }) => useQueryRequest({ effects: configuredEffects, useQuery }),
            { initialProps: { configuredEffects: [] }}
          );

          useQuery.mockImplementation(() => failureResult);

          rerender({ configuredEffects: effects });

          expect(displayAlerts).not.toHaveBeenCalled();
          expect(logResponse).not.toHaveBeenCalled();
        });
      });
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

      expect(displayAlerts).toHaveBeenCalledWith(response, expectedOptions);
      expect(logResponse).toHaveBeenCalledWith(response, expectedOptions);
    });
  });
});
