import type {
  ApiError,
  FetchResponse,
} from '@api';
import { expiredSessionError } from '@api/errors';
import {
  buildFailureResponse,
  buildSuccessResponse,
} from '@api/test-helpers';
import { actions } from '@session/reducer';
import type { ActionCreator } from '@store';
import { formatValue } from '@utils/annotations';
import {
  clearSessionOnExpired,
  clearSessionOnExpiredMatcher,
} from './clear-session-on-expired';

describe('Session middleware', () => {
  const destroySession: ActionCreator = actions.destroy;
  const dispatch = jest.fn();
  const setItem = jest.fn();
  const options = {
    destroySession,
    dispatch,
    setItem,
  };

  beforeEach(() => {
    dispatch.mockClear();
    setItem.mockClear();
  });

  describe('clearSessionOnExpired', () => {
    it('should be a function', () => {
      expect(typeof clearSessionOnExpired).toBe('function');
    });

    it('should return a function', () => {
      expect(typeof clearSessionOnExpired(options)).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = clearSessionOnExpired;
      const expected = {
        matcher: formatValue(clearSessionOnExpiredMatcher),
        name: 'session:middleware:clearSessionOnExpired',
        type: 'api:middleware:matcher',
      };

      expect(formatValue(annotations)).toEqual(expected);
    });
  });

  describe('clearSessionOnExpiredMatcher', () => {
    it('should be a function', () => {
      expect(typeof clearSessionOnExpiredMatcher).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = clearSessionOnExpiredMatcher;
      const expected = {
        name: 'session:middleware:clearSessionOnExpired',
        type: 'matcher',
      };

      expect(annotations).toEqual(expected);
    });

    describe('with a failing result', () => {
      const response: FetchResponse = buildFailureResponse();

      it('should not dispatch an action', () => {
        clearSessionOnExpiredMatcher(response, options);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should not update the store', () => {
        clearSessionOnExpiredMatcher(response, options);

        expect(setItem).not.toHaveBeenCalled();
      });
    });

    describe('with a failing result with type: expired token', () => {
      const error: ApiError = {
        data: {},
        message: 'Something went wrong',
        type: expiredSessionError,
      };
      const response: FetchResponse = buildFailureResponse({ error });

      it('should dispatch the action', () => {
        const action = destroySession({});

        clearSessionOnExpiredMatcher(response, options);

        expect(dispatch).toHaveBeenCalledWith(action);
      });

      it('should update the store', () => {
        clearSessionOnExpiredMatcher(response, options);

        expect(setItem).toHaveBeenCalledWith('session', null);
      });
    });

    describe('with a passing result', () => {
      const response: FetchResponse = buildSuccessResponse();

      it('should not dispatch an action', () => {
        clearSessionOnExpiredMatcher(response, options);

        expect(dispatch).not.toHaveBeenCalled();
      });

      it('should not update the store', () => {
        clearSessionOnExpiredMatcher(response, options);

        expect(setItem).not.toHaveBeenCalled();
      });
    });
  });
});
