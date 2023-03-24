import { alertsMiddleware } from './alerts';
import type {
  Alert,
  AlertsContext,
} from '@alerts';
import type {
  AlertDirective,
  HttpMethod,
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  Response,
} from '../types';
import {
  withError,
  withStatus,
} from '../utils';

describe('API request middleware', () => {
  const dismissAlert = jest.fn();
  const displayAlert = jest.fn();
  const alerts: AlertsContext = {
    alerts: [] as Alert[],
    dismissAlert,
    dismissAllAlerts: jest.fn(),
    displayAlert,
  };

  beforeEach(() => {
    displayAlert.mockClear();
  });

  describe('alertsMiddleware()', () => {
    const response: Response = withStatus({ status: 'success' });
    const performRequest: jest.MockedFunction<PerformRequest> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (url, options) => new Promise(resolve => resolve(response)),
    );
    const config: MiddlewareOptions = { alerts };
    const url = 'www.example.com';
    const method: HttpMethod = 'post';
    const options = { method };
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
    const middleware: Middleware = alertsMiddleware(directives);
    const applied = middleware(performRequest, config);

    it('should be a function', () => {
      expect(typeof alertsMiddleware).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof middleware).toBe('function');
    });

    it('should return a function that returns a function', () => {
      expect(typeof applied).toBe('function');
    });

    it('should perform the request', async () => {
      await applied(url, options);

      expect(performRequest).toHaveBeenCalledWith(url, options);
    });

    describe('with a response that does not match any directives', () => {
      const successResponse: Response = withStatus({ status: 'success' });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(successResponse)),
        );
      });

      it('should not display or dismiss alerts', async () => {
        await applied(url, options);

        expect(dismissAlert).not.toHaveBeenCalled();
        expect(displayAlert).not.toHaveBeenCalled();
      });
    });

    describe('with a response that matches a dismiss directive', () => {
      const failureResponse: Response = withError({
        error: {
          data: {},
          message: 'Something went wrong',
          type: 'spec.errors.genericError',
        },
        errorType: 'spec.errors.genericError',
        response: withStatus({ status: 'failure' }),
      });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(failureResponse)),
        );
      });

      it('should dismiss the alert', async () => {
        await applied(url, options);

        expect(dismissAlert).toHaveBeenCalledWith('errors.context');
        expect(displayAlert).not.toHaveBeenCalled();
      });
    });

    describe('with a response that matches a display directive', () => {
      const failureResponse: Response = withError({
        error: {
          data: {},
          message: 'Oh no',
          type: 'spec.errors.customError',
        },
        errorType: 'spec.errors.customError',
        response: withStatus({ status: 'failure' }),
      });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(failureResponse)),
        );
      });

      it('should display the alert', async () => {
        await applied(url, options);

        expect(dismissAlert).not.toHaveBeenCalled();
        expect(displayAlert).toHaveBeenCalledWith({
          message: 'Self-destruct system engaged',
        });
      });
    });
  });
});
