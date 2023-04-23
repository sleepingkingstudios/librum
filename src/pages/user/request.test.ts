import { renderHook } from '@testing-library/react';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { useGetUserQuery } from './request';
import { useApiQuery } from '@api';

jest.mock('@api');

const mockUseApiQuery =
  useApiQuery as jest.MockedFunction<typeof useApiQuery>;

describe('<UserPage /> request', () => {
  describe('useGetUserQuery()', () => {
    const url = '/api/authentication/user';
    const alerts = [
      {
        status: 'failure',
        display: {
          context: 'pages:user:request',
          icon: faUser,
          message: 'Unable to load current user.',
          type: 'failure',
        },
      },
      {
        status: 'success',
        dismiss: 'pages:user:request',
      },
    ];
    const expected = {
      alerts,
      url,
    };

    beforeEach(() => {
      mockUseApiQuery.mockClear();
    });

    it('should be a function', () => {
      expect(typeof useGetUserQuery).toBe('function');
    });

    it('should configure the request', () => {
      renderHook(() => useGetUserQuery());

      expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
    });
  });
});
