import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import {
  faUserLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

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
import { useUpdateUserPasswordMutation } from '@user/password/api';
import { useStoreDispatch } from '@store/hooks';

jest.mock('@alerts');
jest.mock('@store/hooks');
jest.mock('@user/password/api');

const displayAlert = jest.fn();
const alerts = {
  alerts: [] as Alert[],
  dismissAlert: jest.fn(),
  dismissAllAlerts: jest.fn(),
  displayAlert,
};
const mockAlerts = useAlerts as jest.MockedFunction<typeof useAlerts>;
const mockDispatch = useStoreDispatch as jest.MockedFunction<
  typeof useStoreDispatch
>;
const trigger = jest.fn();
const mockMutation = useUpdateUserPasswordMutation as jest.MockedFunction<
  typeof useUpdateUserPasswordMutation
>;

mockAlerts.mockImplementation(() => alerts);
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
