import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useApiQuery } from './use-api-query';
import { useAlerts as mockUseAlerts } from '@alerts/mocks';
import { selector as selectSession } from '@session';
import type { Session } from '@session';
import {
  useDispatch,
  useSelector,
} from '@store';
import {
  alertsMiddleware,
  apiDataMiddleware,
  authenticationMiddleware,
} from '../middleware';
import type {
  AlertDirective,
  HttpMethod,
  Middleware,
  MiddlewareOptions,
  UseApiQueryOptions,
  UseQuery,
  UseQueryOptions,
} from '../types';
import { useQuery } from './use-query';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@alerts', () => require('@alerts/mocks'));
jest.mock('@store');
jest.mock('../middleware');
jest.mock('./use-query');

const mockAlertsMiddleware =
  alertsMiddleware as jest.MockedFunction<typeof alertsMiddleware>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseQuery = useQuery as jest.MockedFunction<UseQuery>;
const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;

describe('API request hooks', () => {
  const displayAlerts: Middleware = jest.fn();
  const defaultSession: Session = { authenticated: false };
  const dispatch = jest.fn();

  beforeEach(() => {
    mockAlertsMiddleware.mockImplementation(() => displayAlerts);

    mockUseDispatch.mockImplementation(() => dispatch);

    mockUseSelector.mockImplementation(() => defaultSession);
  });

  describe('useApiQuery()', () => {
    const url = '/path/to/resource';
    const defaultOptions: UseApiQueryOptions = { url };
    const expectedConfig: MiddlewareOptions = {
      alerts: mockUseAlerts(),
      dispatch,
      session: defaultSession,
    };
    const expectedMiddleware: Middleware[] = [
      apiDataMiddleware,
      authenticationMiddleware,
    ];
    const expectedOptions: UseQueryOptions = {
      config: expectedConfig,
      middleware: expectedMiddleware,
      url: `${process.env.API_URL}${url}`,
    };

    beforeEach(() => {
      mockUseQuery.mockClear();
    });

    it('should be a function', () => {
      expect(typeof useApiQuery).toBe('function');
    });

    it('should select the current session', () => {
      renderHook(() => useApiQuery(defaultOptions));

      expect(mockUseSelector).toHaveBeenCalledWith(selectSession);
    });

    it('should call useQuery with the default middleware', () => {
      renderHook(() => useApiQuery(defaultOptions));

      expect(mockUseQuery).toHaveBeenCalled();
      expect(mockUseQuery.mock.calls[0]).toEqual([expectedOptions]);
    });

    describe('when the session is authenticated', () => {
      const session: Session = { authenticated: true, token: '12345' };
      const expectedConfig: MiddlewareOptions = {
        alerts: mockUseAlerts(),
        dispatch,
        session,
      };
      const expectedOptions: UseQueryOptions = {
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      beforeEach(() => {
        mockUseSelector.mockImplementationOnce(() => session);
      });

      it('should call useRequest with the default middleware', () => {
        renderHook(() => useApiQuery(defaultOptions));

        expect(mockUseQuery).toHaveBeenCalled();
        expect(mockUseQuery.mock.calls[0]).toEqual([expectedOptions]);
      });
    });

    describe('with alerts: value', () => {
      const directives: AlertDirective[] = [
        {
          errorType: 'spec.errors.customError',
          display: { message: 'Self-destruct system engaged' },
        },
        {
          errorType: 'spec.errors.genericError',
          dismiss: 'errors.context',
        },
        {
          display: { message: 'Something went wrong' },
          status: 'failure',
        },
      ];
      const options: UseApiQueryOptions = {
        ...defaultOptions,
        alerts: directives,
      };
      const expectedMiddleware: Middleware[] = [
        apiDataMiddleware,
        authenticationMiddleware,
        displayAlerts,
      ];
      const expectedOptions: UseQueryOptions = {
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      it('should build the alerts middleware', () => {
        renderHook(() => useApiQuery(options));

        expect(mockAlertsMiddleware).toHaveBeenCalledWith(directives);
      });

      it('should call useQuery with the alerts middleware', () => {
        renderHook(() => useApiQuery(options));

        expect(mockUseQuery).toHaveBeenCalled();
        expect(mockUseQuery.mock.calls[0]).toEqual([expectedOptions]);
      });
    });

    describe('with middleware: value', () => {
      const config: MiddlewareOptions = { custom: 'value' };
      const middleware: Middleware[] = [jest.fn(), jest.fn()];
      const options = {
        config,
        middleware,
        url,
      };
      const expectedConfig: MiddlewareOptions = {
        ...config,
        alerts: mockUseAlerts(),
        dispatch,
        session: defaultSession,
      };
      const expectedMiddleware: Middleware[] = [
        apiDataMiddleware,
        authenticationMiddleware,
        ...middleware,
      ];
      const expectedOptions: UseQueryOptions = {
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      it('should call useQuery with the configured middleware', () => {
        renderHook(() => useApiQuery(options));

        expect(mockUseQuery).toHaveBeenCalled();
        expect(mockUseQuery.mock.calls[0]).toEqual([expectedOptions]);
      });
    });

    describe('with request options', () => {
      const options: UseApiQueryOptions = {
        method: 'post' as HttpMethod,
        url,
      };
      const expectedOptions: UseQueryOptions = {
        ...options,
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      it('should call useQuery with the default middleware', () => {
        renderHook(() => useApiQuery(options));

        expect(mockUseQuery).toHaveBeenCalled();
        expect(mockUseQuery.mock.calls[0]).toEqual([expectedOptions]);
      });
    });

    describe('with request params', () => {
      const options: UseApiQueryOptions = {
        params: { order: 'asc' },
        url,
      };
      const expectedOptions: UseQueryOptions = {
        ...options,
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      it('should call useQuery with the default middleware', () => {
        renderHook(() => useApiQuery(options));

        expect(mockUseQuery).toHaveBeenCalled();
        expect(mockUseQuery.mock.calls[0]).toEqual([expectedOptions]);
      });
    });
  });
});
