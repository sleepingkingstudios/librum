import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

import {
  useMutation,
  useRequest,
} from './request';
import type {
  FetchFailure,
  FetchSuccess,
} from '@api';
import {
  buildFailureResponse,
  buildSuccessResponse,
  fetchErrorResponse,
  serializedErrorResponse,
  wrapResponse,
} from '@api/test-helpers';
import { formatValue } from '@utils/annotations';

const user = {
  email: 'alan.bradley@example.com',
  id: 0,
  role: 'user',
  slug: 'alan-bradley',
  username: 'Alan Bradley',
};
const session = {
  authenticated: true,
  token: '12345',
  user,
};
const failureResponse = buildFailureResponse();
const successResponse = buildSuccessResponse({
  data: session,
});

describe('LoginPage request', () => {
  describe('useMutation', () => {
    it('should be a function', () => {
      expect(typeof useMutation).toBe('function');
    });

    it('should be annotated', () => {
      const expected = {
        name: 'useCreateSessionMutation',
        type: 'hooks:useMutation',
      };

      expect(useMutation.annotations).toEqual(expected);
    });
  });

  describe('useRequest', () => {
    const action = { authenticated: true };
    const createSession = jest.fn(() => action);
    const dismissAlert = jest.fn();
    const dispatch = jest.fn();
    const displayAlert = jest.fn();
    const setItem = jest.fn();
    const mutation = jest.fn(() => wrapResponse(successResponse));
    const options = {
      createSession,
      dismissAlert,
      dispatch,
      displayAlert,
      setItem,
    };
    const request = useRequest({
      mutation,
      options,
    });
    const values = {
      username: 'Tron',
      password: 'ifightfortheusers',
    };

    beforeEach(() => {
      createSession.mockClear();
      dismissAlert.mockClear();
      dispatch.mockClear();
      displayAlert.mockClear();
      mutation.mockClear();
      setItem.mockClear();
    });

    it('should be a function', () => {
      expect(typeof useRequest).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof request).toBe('function');
    });

    it('should call the mutation', async () => {
      await request(values);

      expect(mutation).toHaveBeenCalledWith(values);
    });

    it('should be annotated', () => {
      const expected = {
        middleware: [
          {
            name: 'sessions:createSession',
            type: 'middleware',
          },
          {
            name: 'sessions:storeSession',
            type: 'middleware',
          },
          {
            matcher: {
              name: 'page:login:alerts',
              type: 'matcher',
            },
            name: 'page:login:alerts',
            type: 'api:middleware:matcher'
          },
        ],
        name: 'pages:login:request',
        params: {},
        type: 'hooks:useRequest',
      };

      expect(formatValue(useRequest.annotations)).toEqual(expected);
    });

    describe('when the mutation returns a fetch error response', () => {
      const response: FetchFailure = fetchErrorResponse;

      beforeEach(() => {
        mutation.mockImplementationOnce(() => wrapResponse(response));
      });

      it('should not create a session', async () => {
        await request(values);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should not store a session', async () => {
        await request(values);

        expect(setItem).not.toHaveBeenCalled();
      });

      it('should display an alert', async () => {
        const expected = {
          context: 'authentication:session',
          icon: faUserSlash,
          message: 'User not found with the provided username and password.',
          type: 'failure',
        };

        await request(values);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });
    });

    describe('when the mutation returns a serialized error response', () => {
      const response: FetchFailure = serializedErrorResponse;

      beforeEach(() => {
        mutation.mockImplementationOnce(() => wrapResponse(response));
      });

      it('should not create a session', async () => {
        await request(values);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should not store a session', async () => {
        await request(values);

        expect(setItem).not.toHaveBeenCalled();
      });

      it('should display an alert', async () => {
        const expected = {
          context: 'authentication:session',
          icon: faUserSlash,
          message: 'User not found with the provided username and password.',
          type: 'failure',
        };

        await request(values);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });
    });

    describe('when the mutation returns a failing response', () => {
      const response: FetchFailure = failureResponse;

      beforeEach(() => {
        mutation.mockImplementationOnce(() => wrapResponse(response));
      });

      it('should not create a session', async () => {
        await request(values);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should not store a session', async () => {
        await request(values);

        expect(setItem).not.toHaveBeenCalled();
      });

      it('should display an alert', async () => {
        const expected = {
          context: 'authentication:session',
          icon: faUserSlash,
          message: 'User not found with the provided username and password.',
          type: 'failure',
        };

        await request(values);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });
    });

    describe('when the mutation returns a successful response', () => {
      const response: FetchSuccess = successResponse;

      beforeEach(() => {
        mutation.mockImplementationOnce(() => wrapResponse(response));
      });

      it('should create the session', async () => {
        await request(values);

        expect(dispatch).toHaveBeenCalledWith(action);
      });

      it('should store the session', async () => {
        const expected = JSON.stringify(session);

        await request(values);

        expect(setItem).toHaveBeenCalledWith('session', expected);
      });

      it('should clear the error', async () => {
        await request(values);

        expect(dismissAlert).toHaveBeenCalledWith('authentication:session');
      });
    });
  });
});
