import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import {
  faUserLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

import { useRequest } from './request';
import { useAlerts as mockUseAlerts } from '@alerts/mocks';
import { invalidPasswordError } from '@api/errors';
import {
  defaultResult,
  defaultResponse,
  failureResult,
  failureResponse,
  successResult,
  successResponse,
} from '@api/test-helpers';
import { useUpdateUserPasswordMutation } from '@user/password/api';
import { useStoreDispatch } from '@store/hooks';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@alerts', () => require('@alerts/mocks'));
jest.mock('@store/hooks');
jest.mock('@user/password/api');

const alerts = mockUseAlerts();
const { displayAlert } = alerts;
const mockDispatch = useStoreDispatch as jest.MockedFunction<
  typeof useStoreDispatch
>;
const trigger = jest.fn();
const mockMutation = useUpdateUserPasswordMutation as jest.MockedFunction<
  typeof useUpdateUserPasswordMutation
>;

mockDispatch.mockImplementation(() => jest.fn());
mockMutation.mockImplementation(() => [trigger, defaultResult]);

beforeEach(() => {
  displayAlert.mockClear();
  mockMutation.mockClear();
  trigger.mockClear();
});

describe('<UserUpdatePasswordForm />', () => {
  describe('useRequest()', () => {
    const closeForm = jest.fn();
    const options = { closeForm };

    beforeEach(() => { closeForm.mockClear(); });

    it('should call the mutation', () => {
      renderHook(() => useRequest({ options }));

      expect(mockMutation).toHaveBeenCalled();
    });

    it('should return the trigger and response', () => {
      const { result } = renderHook(() => useRequest({ options }));

      expect(result.current).toEqual([trigger, defaultResponse]);
    });

    describe('when the mutation returns a failure response', () => {
      beforeEach(() => {
        mockMutation.mockImplementation(() => [trigger, failureResult])
      });

      it('should return the trigger and response', () => {
        const { result } = renderHook(() => useRequest({ options }));

        expect(result.current).toEqual([trigger, failureResponse]);
      });

      it('should display an alert', () => {
        renderHook(() => useRequest({ options }));

        expect(displayAlert).toHaveBeenCalledWith({
          context: 'pages:user:updatePassword:alerts',
          icon: faUserSlash,
          message: 'Unable to update password.',
          type: 'failure',
        });
      });
    });

    describe('when the mutation returns an invalid password response', () => {
      const error = {
        data: {},
        message: 'password does not match encrypted value',
        type: invalidPasswordError,
      };
      const errorResult = {
        ...failureResult,
        error: {
          data: {
            ok: false,
            error,
          },
          status: 400,
        },
      }

      beforeEach(() => {
        mockMutation.mockImplementation(() => [trigger, errorResult])
      });

      it('should display an alert', () => {
        renderHook(() => useRequest({ options }));

        expect(displayAlert).toHaveBeenCalledWith({
          context: 'pages:user:updatePassword:alerts',
          icon: faUserSlash,
          message: 'Password does not match current password.',
          type: 'failure',
        });
      });
    });

    describe('when the mutation returns a success response', () => {
      beforeEach(() => {
        mockMutation.mockImplementation(() => [trigger, successResult])
      });

      it('should return the trigger and response', () => {
        const { result } = renderHook(() => useRequest({ options }));

        expect(result.current).toEqual([trigger, successResponse]);
      });

      it('should close the form', () => {
        renderHook(() => useRequest({ options }));

        expect(closeForm).toHaveBeenCalled();
      });

      it('should display an alert', () => {
        renderHook(() => useRequest({ options }));

        expect(displayAlert).toHaveBeenCalledWith({
          context: 'pages:user:updatePassword:alerts',
          icon: faUserLock,
          message: 'Successfully updated password.',
          type: 'success',
        });
      });
    });
  });
});
