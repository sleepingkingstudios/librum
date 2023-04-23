import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import {
  faUserLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

import {
  closeFormMiddleware,
  useUpdateUserPasswordRequest,
} from './request';
import { useApiRequest } from '@api';
import type { PerformRequest } from '@api';
import { invalidPasswordError } from '@api/errors';
import { withStatus as responseWithStatus } from '@api/utils';

jest.mock('@api');

const mockUseApiRequest =
  useApiRequest as jest.MockedFunction<typeof useApiRequest>;

describe('<UserUpdatePassword /> request', () => {
  describe('closeFormMiddleware()', () => {
    const response = responseWithStatus({ status: 'uninitialized' });
    const performRequest: jest.MockedFunction<PerformRequest> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (url, options) => new Promise(resolve => resolve(response))
    );
    const closeForm = jest.fn();
    const config = { closeForm };
    const applied = closeFormMiddleware(performRequest, config);
    const url = 'www.example.com';
    const options = { params: { sort: 'ascending' } };

    beforeEach(() => {
      closeForm.mockClear();

      performRequest.mockClear();
    });

    it('should be a function', () => {
      expect(typeof closeFormMiddleware).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof applied).toBe('function');
    });

    it('should perform the request', async () => {
      await applied(url, options);

      expect(performRequest).toHaveBeenCalledWith(url, options);
    });

    it('should return the response', async () => {
      expect(await applied(url, options)).toEqual(response);
    });

    it('should not close the form', async () => {
      await applied(url, options);

      expect(closeForm).not.toHaveBeenCalled();
    });

    describe('when the response is loading', () => {
      const loadingResponse = responseWithStatus({ status: 'loading' });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(loadingResponse))
        );
      });

      it('should not close the form', async () => {
        await applied(url, options);

        expect(closeForm).not.toHaveBeenCalled();
      });
    });

    describe('when the response is failing', () => {
      const loadingResponse = responseWithStatus({ status: 'failure' });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(loadingResponse))
        );
      });

      it('should not close the form', async () => {
        await applied(url, options);

        expect(closeForm).not.toHaveBeenCalled();
      });
    });

    describe('when the response is successful', () => {
      const loadingResponse = responseWithStatus({ status: 'success' });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(loadingResponse))
        );
      });

      it('should close the form', async () => {
        await applied(url, options);

        expect(closeForm).toHaveBeenCalled();
      });
    });
  });

  describe('useUpdateUserPasswordRequest()', () => {
    const closeForm = jest.fn();
    const config = { closeForm };
    const url = '/api/authentication/user/password';
    const method = 'patch';
    const alerts = [
      {
        errorType: invalidPasswordError,
        display: {
          context: 'pages:user:updatePassword:alerts',
          icon: faUserSlash,
          message: 'Password does not match current password.',
          type: 'failure',
        },
      },
      {
        status: 'failure',
        display: {
          context: 'pages:user:updatePassword:alerts',
          icon: faUserSlash,
          message: 'Unable to update password.',
          type: 'failure',
        },
      },
      {
        status: 'success',
        display: {
          context: 'pages:user:updatePassword:alerts',
          icon: faUserLock,
          message: 'Successfully updated password.',
          type: 'success',
        },
      },
    ];
    const middleware = [closeFormMiddleware];
    const expected = {
      alerts,
      config,
      middleware,
      method,
      url,
    };

    beforeEach(() => {
      mockUseApiRequest.mockClear();
    });

    it('should be a function', () => {
      expect(typeof useUpdateUserPasswordRequest).toBe('function');
    });

    it('should configure the request', () => {
      renderHook(
        () => useUpdateUserPasswordRequest({ config })
      );

      expect(mockUseApiRequest).toHaveBeenCalledWith(expected);
    });
  });
});
