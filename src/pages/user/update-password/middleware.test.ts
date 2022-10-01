import {
  faUserLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

import type { FetchResponse } from '@api';
import {
  buildFailureResponse,
  buildSuccessResponse,
  wrapResponse,
} from '@api/test-helpers';
import { formatValue } from '@utils/annotations';
import {
  closeFormOnSuccess,
  displayAlerts,
  displayAlertsMatcher,
} from './middleware';

describe('<UserUpdatePasswordForm /> middleware', () => {
  describe('closeFormOnSuccess', () => {
    const closeForm = jest.fn();
    const middleware = closeFormOnSuccess({ closeForm });

    beforeEach(() => { closeForm.mockClear(); });

    it('should be a function', () => {
      expect(typeof closeForm).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof middleware).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = closeFormOnSuccess;
      const expected = {
        name: 'pages:user:updatePassword:closeFormOnSuccess',
        type: 'middleware',
      };

      expect(annotations).toEqual(expected);
    });

    describe('with a failing result', () => {
      const response: FetchResponse = buildFailureResponse();
      const next = jest.fn(() => wrapResponse(response));
      const param = {};

      beforeEach(() => { next.mockClear(); });

      it('should call the next function', async () => {
        await middleware(next, param);

        expect(next).toHaveBeenCalledWith(param);
      });

      it('should not close the form', async () => {
        await middleware(next, param);

        expect(closeForm).not.toHaveBeenCalled();
      });
    });

    describe('with a passing result', () => {
      const response: FetchResponse = buildSuccessResponse();
      const next = jest.fn(() => wrapResponse(response));
      const param = {};

      beforeEach(() => { next.mockClear(); });

      it('should call the next function', async () => {
        await middleware(next, param);

        expect(next).toHaveBeenCalledWith(param);
      });

      it('should close the form', async () => {
        await middleware(next, param);

        expect(closeForm).toHaveBeenCalled();
      });
    });
  });

  describe('displayAlerts', () => {
    const displayAlert = jest.fn();
    const options = { displayAlert };

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
        name: 'pages:user:updatePassword:alerts',
        type: 'api:middleware:matcher',
      };

      expect(formatValue(annotations)).toEqual(expected);
    });
  });

  describe('displayAlertsMatcher', () => {
    const displayAlert = jest.fn();
    const options = { displayAlert };

    beforeEach(() => { displayAlert.mockClear(); });

    it('should be a function', () => {
      expect(typeof displayAlertsMatcher).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = displayAlertsMatcher;
      const expected = {
        name: 'pages:user:updatePassword:alerts',
        type: 'matcher',
      };

      expect(annotations).toEqual(expected);
    });

    describe('with a failing result', () => {
      const response: FetchResponse = buildFailureResponse();

      it('should display the alert', () => {
        const expected = {
          context: 'pages:user:updatePassword:alerts',
          icon: faUserSlash,
          message: 'Unable to update password.',
          type: 'failure',
        };

        displayAlertsMatcher(response, options);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });
    });

    describe('with a successful result', () => {
      const response: FetchResponse = buildSuccessResponse();

      it('should display the alert', () => {
        const expected = {
          context: 'pages:user:updatePassword:alerts',
          icon: faUserLock,
          message: 'Successfully updated password.',
          type: 'success',
        };

        displayAlertsMatcher(response, options);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });
    });
  });
});
