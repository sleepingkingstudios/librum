import { renderHook } from '@testing-library/react';

import { useGetUserRequest } from './request';
import { useAlerts as mockUseAlerts } from '@alerts/mocks';
import {
  failureResult,
  loadingResult,
} from '@api/test-helpers';
import { useGetUserQuery } from '@user/api';

jest.mock('@alerts', () => require('@alerts/mocks'));
jest.mock('@store/hooks');
jest.mock('@user/api');

const alerts = mockUseAlerts();
const { displayAlert } = alerts;
const mockUseGetUserQuery = useGetUserQuery as jest.MockedFunction<typeof useGetUserQuery>;

describe('UserPage request', () => {
  beforeEach(() => { displayAlert.mockClear(); });

  describe('with a failing response', () => {
    it('should display an alert', () => {
      mockUseGetUserQuery.mockImplementation(() => loadingResult);

      const { rerender } = renderHook(() => useGetUserRequest());

      mockUseGetUserQuery.mockImplementation(() => failureResult);

      rerender();

      expect(displayAlert).toHaveBeenCalled();
    });
  });
});
