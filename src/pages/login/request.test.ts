import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

import {
  createSessionMiddleware,
  useLoginRequest,
} from './request';
import { useApiRequest } from '@api';
import type { PerformRequest } from '@api';
import {
  withData as responseWithData,
  withStatus as responseWithStatus,
} from '@api/utils';
import type {
  Session,
  User,
} from '@session';
import { actions as sessionActions } from '@session/reducer';

jest.mock('@api');

const mockUseRequest =
  useApiRequest as jest.MockedFunction<typeof useApiRequest>;

describe('<LoginPage /> request', () => {
  describe('createSessionMiddleware()', () => {
    const response = responseWithStatus({ status: 'uninitialized' });
    const performRequest: jest.MockedFunction<PerformRequest> = jest.fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (url, options) => new Promise(resolve => resolve(response))
    );
    const dispatch = jest.fn();
    const config = { dispatch };
    const applied = createSessionMiddleware(performRequest, config);
    const url = 'www.example.com';
    const options = { params: { sort: 'ascending' } };

    beforeEach(() => {
      dispatch.mockClear();
    });

    it('should be a function', () => {
      expect(typeof createSessionMiddleware).toBe('function');
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

    it('should not dispatch an action', async () => {
      await applied(url, options);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should not update the stored session', async () => {
      await applied(url, options);

      expect(localStorage.getItem('session')).toBeNull();
    });

    describe('when the response is loading', () => {
      const loadingResponse = responseWithStatus({ status: 'loading' });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(loadingResponse))
        );
      });

      it('should not dispatch an action', async () => {
        await applied(url, options);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should not update the stored session', async () => {
        await applied(url, options);

        expect(localStorage.getItem('session')).toBeNull();
      });
    });

    describe('when the response is failing', () => {
      const failureResponse = responseWithStatus({ status: 'failure' });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(failureResponse))
        );
      });

      it('should not dispatch an action', async () => {
        await applied(url, options);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should not update the stored session', async () => {
        await applied(url, options);

        expect(localStorage.getItem('session')).toBeNull();
      });
    });

    describe('when the response is successful', () => {
      const user: User = {
        email: 'alan.bradley@example.com',
        id: '00000000-0000-0000-0000-000000000000',
        role: 'user',
        slug: 'alan-bradley',
        username: 'Alan Bradley',
      };
      const token = '12345';
      const session: Session = {
        authenticated: true,
        token,
        user,
      };
      const successResponse = responseWithData({
        data: {
          token,
          user,
        },
      });

      beforeEach(() => {
        performRequest.mockImplementationOnce(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (url, options) => new Promise(resolve => resolve(successResponse))
        );
      });

      it('should dispatch an action', async () => {
        const expected = sessionActions.create({ token, user });

        await applied(url, options);

        expect(dispatch).toHaveBeenCalledWith(expected);
      });

      it('should update the stored session', async () => {
        const expected = JSON.stringify(session);

        await applied(url, options);

        expect(localStorage.getItem('session')).toEqual(expected);
      });
    });
  });

  describe('useLoginRequest()', () => {
    const alerts = [
      {
        dismiss: 'authentication:session',
        status: 'success',
      },
      {
        display:  {
          context: 'authentication:session',
          icon: faUserSlash,
          message: 'User not found with the provided username and password.',
          type: 'failure',
        },
        status: 'failure',
      }
    ];
    const middleware = [createSessionMiddleware];

    it('should be a function', () => {
      expect(typeof useLoginRequest).toBe('function');
    });

    it('should configure the request', () => {
      renderHook(() => useLoginRequest());

      expect(mockUseRequest).toHaveBeenCalled();
      expect(mockUseRequest.mock.calls).toHaveLength(1);

      const options = mockUseRequest.mock.calls[0][0];
      expect(options.url).toBe('/api/authentication/session');
      expect(options.alerts).toEqual(alerts);
      expect(options.method).toBe('post');
      expect(options.config).toBeUndefined();
      expect(options.middleware).toEqual(middleware);
    });
  });
});
