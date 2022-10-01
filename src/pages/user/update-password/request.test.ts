import {
  useMutation,
  useRequest,
} from './request';
import {
  buildSuccessResponse,
  wrapResponse,
} from '@api/test-helpers';
import { formatValue } from '@utils/annotations';

const successResponse = buildSuccessResponse();

describe('<UserUpdatePasswordForm /> request', () => {
  describe('useMutation', () => {
    it('should be a function', () => {
      expect(typeof useMutation).toBe('function');
    });

    it('should be annotated', () => {
      const expected = {
        name: 'useUpdateUserPasswordMutation',
        type: 'hooks:useMutation',
      };

      expect(useMutation.annotations).toEqual(expected);
    });
  });

  describe('useRequest', () => {
    const action = { authenticated: false };
    const closeForm = jest.fn();
    const destroySession = jest.fn(() => action);
    const dispatch = jest.fn();
    const displayAlert = jest.fn();
    const setItem = jest.fn();
    const mutation = jest.fn(() => wrapResponse(successResponse));
    const options = {
      closeForm,
      destroySession,
      dispatch,
      displayAlert,
      setItem,
    };
    const request = useRequest({
      mutation,
      options,
    });
    const values = {
      oldPassword: 'tronlives',
      newPassword: 'ifightfortheusers',
      confirmPassword: 'ifightfortheusers',
    };

    beforeEach(() => {
      closeForm.mockClear();
      destroySession.mockClear();
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
      const expected = {
        old_password: 'tronlives',
        new_password: 'ifightfortheusers',
        confirm_password: 'ifightfortheusers',
      };

      await request(values);

      expect(mutation).toHaveBeenCalledWith(expected);
    });

    it('should be annotated', () => {
      const expected = {
        middleware: [
          {
            matcher: {
              name: 'session:middleware:clearSessionOnExpired',
              type: 'matcher',
            },
            name: 'session:middleware:clearSessionOnExpired',
            type: 'api:middleware:matcher'
          },
          {
            name: 'pages:user:updatePassword:closeFormOnSuccess',
            type: 'middleware',
          },
          {
            name: 'api:middleware:convertRequestToSnakeCase',
            type: 'api:middleware:convertRequestToSnakeCase',
          },
          {
            matcher: {
              name: 'pages:user:updatePassword:alerts',
              type: 'matcher',
            },
            name: 'pages:user:updatePassword:alerts',
            type: 'api:middleware:matcher'
          },
        ],
        name: 'pages:user:updatePassword:request',
        params: {},
        type: 'hooks:useRequest',
      };

      expect(formatValue(useRequest.annotations)).toEqual(expected);
    });
  });
});
