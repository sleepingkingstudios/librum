import { renderHook } from '@testing-library/react';

import { useGetUserRequest } from './request';
import { useAlerts } from '@alerts';
import {
  defaultOptions,
  failureResult,
  loadingResult,
} from '@api/hooks/test-helpers';
import { useGetUserQuery } from '@user/api';

jest.mock('@alerts');
jest.mock('@store/hooks');
jest.mock('@user/api');

const mockUseGetUserQuery = useGetUserQuery as jest.MockedFunction<typeof useGetUserQuery>;
const mockUseAlerts = useAlerts as jest.MockedFunction<typeof useAlerts>;

mockUseAlerts.mockImplementation(() => defaultOptions.alerts);

describe('UserPage request', () => {
  const options = defaultOptions;
  const { alerts } = options;
  const { displayAlert } = alerts;
  const mockDisplayAlert = displayAlert as jest.MockedFunction<typeof displayAlert>;

  beforeEach(() => { mockDisplayAlert.mockClear(); });

  describe('with a failing response', () => {
    it('should display an alert', () => {
      mockUseGetUserQuery.mockImplementation(() => loadingResult);

      const { rerender } = renderHook(() => useGetUserRequest());

      mockUseGetUserQuery.mockImplementation(() => failureResult);

      rerender();

      expect(mockDisplayAlert).toHaveBeenCalled();
    });
  });
});
