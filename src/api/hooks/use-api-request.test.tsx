import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useApiRequest } from './use-api-request';
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
  UseApiRequestOptions,
  UseRequest,
  UseRequestOptions,
} from '../types';
import { useRequest } from './use-request';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@alerts', () => require('@alerts/mocks'));
jest.mock('@store');
jest.mock('../middleware');
jest.mock('./use-request');

const mockAlertsMiddleware =
  alertsMiddleware as jest.MockedFunction<typeof alertsMiddleware>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseRequest = useRequest as jest.MockedFunction<UseRequest>;
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

  describe('useApiRequest()', () => {
    const url = '/path/to/resource';
    const defaultOptions: UseApiRequestOptions = { url };
    const expectedConfig: MiddlewareOptions = {
      alerts: mockUseAlerts(),
      dispatch,
      session: defaultSession,
    };
    const expectedMiddleware: Middleware[] = [
      apiDataMiddleware,
      authenticationMiddleware,
    ];
    const expectedOptions: UseRequestOptions = {
      config: expectedConfig,
      middleware: expectedMiddleware,
      url: `${process.env.API_URL}${url}`,
    };

    beforeEach(() => {
      mockUseRequest.mockClear();
    });

    it('should be a function', () => {
      expect(typeof useApiRequest).toBe('function');
    });

    it('should select the current session', () => {
      renderHook(() => useApiRequest(defaultOptions));

      expect(mockUseSelector).toHaveBeenCalledWith(selectSession);
    });

    it('should call useRequest with the default middleware', () => {
      renderHook(() => useApiRequest(defaultOptions));

      expect(mockUseRequest).toHaveBeenCalled();
      expect(mockUseRequest.mock.calls[0]).toEqual([expectedOptions]);
    });

    describe('when the session is authenticated', () => {
      const session: Session = { authenticated: true, token: '12345' };
      const expectedConfig: MiddlewareOptions = {
        alerts: mockUseAlerts(),
        dispatch,
        session,
      };
      const expectedOptions: UseRequestOptions = {
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      beforeEach(() => {
        mockUseSelector.mockImplementationOnce(() => session);
      });

      it('should call useRequest with the default middleware', () => {
        renderHook(() => useApiRequest(defaultOptions));

        expect(mockUseRequest).toHaveBeenCalled();
        expect(mockUseRequest.mock.calls[0]).toEqual([expectedOptions]);
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
      const options: UseApiRequestOptions = {
        ...defaultOptions,
        alerts: directives,
      };
      const expectedMiddleware: Middleware[] = [
        apiDataMiddleware,
        authenticationMiddleware,
        displayAlerts,
      ];
      const expectedOptions: UseRequestOptions = {
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      it('should build the alerts middleware', () => {
        renderHook(() => useApiRequest(options));

        expect(mockAlertsMiddleware).toHaveBeenCalledWith(directives);
      });

      it('should call useRequest with the alerts middleware', () => {
        renderHook(() => useApiRequest(options));

        expect(mockUseRequest).toHaveBeenCalled();
        expect(mockUseRequest.mock.calls[0]).toEqual([expectedOptions]);
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
      const expectedOptions: UseRequestOptions = {
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      it('should call useRequest with the configured middleware', () => {
        renderHook(() => useApiRequest(options));

        expect(mockUseRequest).toHaveBeenCalled();
        expect(mockUseRequest.mock.calls[0]).toEqual([expectedOptions]);
      });
    });

    describe('with request options', () => {
      const options: UseApiRequestOptions = {
        method: 'post' as HttpMethod,
        url,
      };
      const expectedOptions: UseRequestOptions = {
        ...options,
        config: expectedConfig,
        middleware: expectedMiddleware,
        url: `${process.env.API_URL}${url}`,
      };

      it('should call useRequest with the default middleware', () => {
        renderHook(() => useApiRequest(options));

        expect(mockUseRequest).toHaveBeenCalled();
        expect(mockUseRequest.mock.calls[0]).toEqual([expectedOptions]);
      });
    });
  });
});
