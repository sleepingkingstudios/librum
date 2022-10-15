import { displayAlerts } from './display-alerts';
import type { AlertDirective } from './display-alerts';
import type {
  Alert,
  AlertsContext,
} from '@alerts';
import {
  defaultOptions,
  defaultResponse,
} from '../test-helpers';
import type {
  Effect,
  Response,
} from '../types';

describe('API effects displayAlerts()', () => {
  const dismissAlert = jest.fn();
  const displayAlert = jest.fn();
  const alerts: AlertsContext = {
    alerts: [] as Alert[],
    dismissAlert,
    dismissAllAlerts: jest.fn(),
    displayAlert,
  };
  const options = {
    ...defaultOptions,
    alerts,
  };
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
  const effect: Effect = displayAlerts(directives);

  beforeEach(() => {
    dismissAlert.mockClear();
    displayAlert.mockClear();
  });

  it('should be a function', () => {
    expect(typeof displayAlerts).toBe('function');
  });

  it('should return a function', () => {
    expect(typeof effect).toBe('function');
  });

  describe('with annotations', () => {
    const annotated: Effect = displayAlerts(
      directives,
      { name: 'spec.displayAlerts' },
    );

    it('should annotate the effect', () => {
      expect(annotated.annotations).toEqual({
        options: {
          alerts: directives,
        },
        name: 'spec.displayAlerts',
        type: 'api:effects:displayAlerts',
      });
    });
  });

  describe('with a response that does not match any directives', () => {
    const successResponse: Response = {
      ...defaultResponse,
      isSuccess: true,
      status: 'success',
    };

    it('should not display or dismiss alerts', () => {
      effect(successResponse, options);

      expect(dismissAlert).not.toHaveBeenCalled();
      expect(displayAlert).not.toHaveBeenCalled();
    });
  });

  describe('with a response that matches a dismiss directive', () => {
    const failureResponse: Response = {
      ...defaultResponse,
      error: {
        data: {},
        message: 'Something went wrong',
        type: 'spec.errors.genericError',
      },
      errorType: 'spec.errors.genericError',
      hasError: true,
      isFailure: true,
      status: 'failure',
    };

    it('should dismiss the alert', () => {
      effect(failureResponse, options);

      expect(dismissAlert).toHaveBeenCalledWith('errors.context');
      expect(displayAlert).not.toHaveBeenCalled();
    });
  });

  describe('with a response that matches a display directive', () => {
    const failureResponse: Response = {
      ...defaultResponse,
      error: {
        data: {},
        message: 'Oh no',
        type: 'spec.errors.customError',
      },
      errorType: 'spec.errors.customError',
      hasError: true,
      isFailure: true,
      status: 'failure',
    };

    it('should display the alert', () => {
      effect(failureResponse, options);

      expect(dismissAlert).not.toHaveBeenCalled();
      expect(displayAlert).toHaveBeenCalledWith({
        message: 'Self-destruct system engaged',
      });
    });
  });
});
