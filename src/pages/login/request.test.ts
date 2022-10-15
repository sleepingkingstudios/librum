import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

import { useRequest } from './request';
import { useAlerts } from '@alerts';
import type { Alert } from '@alerts';
import {
  defaultResult,
  defaultResponse,
  failureResult,
  failureResponse,
  successResult,
  successResponse,
} from '@api/hooks/test-helpers';
import { useCreateSessionMutation } from '@session/api';
import { actions as sessionActions } from '@session/reducer';
import { useStoreDispatch } from '@store/hooks';

jest.mock('@alerts');
jest.mock('@session/api');
jest.mock('@store/hooks');

const dismissAlert = jest.fn();
const displayAlert = jest.fn();
const alerts = {
  alerts: [] as Alert[],
  dismissAlert,
  dismissAllAlerts: jest.fn(),
  displayAlert,
};
const mockAlerts = useAlerts as jest.MockedFunction<typeof useAlerts>;
const dispatch = jest.fn();
const mockDispatch = useStoreDispatch as jest.MockedFunction<
  typeof useStoreDispatch
>;
const trigger = jest.fn();
const mockMutation = useCreateSessionMutation as jest.MockedFunction<
  typeof useCreateSessionMutation
>;

mockAlerts.mockImplementation(() => alerts);
mockDispatch.mockImplementation(() => dispatch);
mockMutation.mockImplementation(() => [trigger, defaultResult]);

beforeEach(() => {
  dismissAlert.mockClear();
  displayAlert.mockClear();
  dispatch.mockClear();
  trigger.mockClear();
});

describe('LoginPage request', () => {
  describe('useRequest()', () => {
    beforeEach(() => { mockMutation.mockClear(); });

    it('should call the mutation', () => {
      renderHook(() => useRequest());

      expect(mockMutation).toHaveBeenCalled();
    });

    it('should return the trigger and response', () => {
      const { result } = renderHook(() => useRequest());

      expect(result.current).toEqual([trigger, defaultResponse]);
    });

    describe('when the mutation returns a failure response', () => {
      beforeEach(() => {
        mockMutation.mockImplementation(() => [trigger, failureResult])
      });

      it('should return the trigger and response', () => {
        const { result } = renderHook(() => useRequest());

        expect(result.current).toEqual([trigger, failureResponse]);
      });

      it('should display an alert', () => {
        renderHook(() => useRequest());

        expect(displayAlert).toHaveBeenCalledWith({
          context: 'authentication:session',
          icon: faUserSlash,
          message: 'User not found with the provided username and password.',
          type: 'failure',
        });
      });
    });

    describe('when the mutation returns a success response', () => {
      const user = {
        email: 'alan.bradley@example.com',
        id: '0',
        role: 'user',
        slug: 'alan-bradley',
        username: 'Alan Bradley',
      };
      const token = '12345';
      const session = {
        authenticated: true,
        token,
        user,
      };
      const data = { token, user };
      const result = {
        ...successResult,
        data: { ok: true, data },
      };
      const response = {
        ...successResponse,
        data,
      };

      beforeEach(() => {
        mockMutation.mockImplementation(() => [trigger, result])
      });

      afterEach(() => { localStorage.clear(); });

      it('should return the trigger and response', () => {
        const { result } = renderHook(() => useRequest());

        expect(result.current).toEqual([trigger, response]);
      });

      it('should dismiss the alert', () => {
        renderHook(() => useRequest());

        expect(dismissAlert).toHaveBeenCalledWith('authentication:session');
      });

      it('should create the session', () => {
        const expectedAction = sessionActions.create({ token, user });

        renderHook(() => useRequest());

        expect(dispatch).toHaveBeenCalledWith(expectedAction);
      });

      it('should store the session', () => {
        const expected = JSON.stringify(session);

        renderHook(() => useRequest());

        expect(localStorage.getItem('session')).toEqual(expected);
      });
    });
  });
});
