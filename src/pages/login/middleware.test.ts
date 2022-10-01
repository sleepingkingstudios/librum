import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

import {
  displayAlerts,
  displayAlertsMatcher,
} from './middleware';
import type { FetchResponse } from '@api';
import {
  buildFailureResponse,
  buildSuccessResponse,
} from '@api/test-helpers';
import { formatValue } from '@utils/annotations';

describe('LoginPage middleware', () => {
  const dismissAlert = jest.fn();
  const displayAlert = jest.fn();
  const options = {
    dismissAlert,
    displayAlert,
  };

  describe('displayAlerts', () => {
    it('should be a function', () => {
      expect(typeof displayAlerts).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof displayAlerts(options)).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = displayAlerts;
      const expected = {
        matcher: formatValue(displayAlertsMatcher),
        name: 'page:login:alerts',
        type: 'api:middleware:matcher',
      };

      expect(formatValue(annotations)).toEqual(expected);
    });
  });

  describe('displayAlertsMatcher', () => {
    beforeEach(() => {
      dismissAlert.mockClear();
      displayAlert.mockClear();
    });

    it('should be a function', () => {
      expect(typeof displayAlertsMatcher).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = displayAlertsMatcher;
      const expected = {
        name: 'page:login:alerts',
        type: 'matcher',
      };

      expect(annotations).toEqual(expected);
    });

    describe('with a failing result', () => {
      const response: FetchResponse = buildFailureResponse();

      it('should not dismiss an alert', () => {
        displayAlertsMatcher(response, options);

        expect(dismissAlert).not.toHaveBeenCalled();
      });

      it('should display the alert', () => {
        const expected = {
          context: 'authentication:session',
          icon: faUserSlash,
          message: 'User not found with the provided username and password.',
          type: 'failure',
        };

        displayAlertsMatcher(response, options);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });
    });

    describe('with a successful result', () => {
      const response: FetchResponse = buildSuccessResponse();

      it('should dismiss the alert', () => {
        displayAlertsMatcher(response, options);

        expect(dismissAlert).toHaveBeenCalledWith('authentication:session');
      });

      it('should not display an alert', () => {
        displayAlertsMatcher(response, options);

        expect(displayAlert).not.toHaveBeenCalled();
      });
    });
  });
});
