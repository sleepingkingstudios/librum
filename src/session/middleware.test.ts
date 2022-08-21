import type { FetchResponse } from '@api';
import type {
  Session,
  User,
} from '@session';
import type { Login } from '@session/api';
import { actions } from '@session/reducer';

import {
  createSession,
  storeSession,
} from './middleware';

type SetItem = (key: string, value: unknown) => unknown;

describe('Session middleware', () => {
  const login: Login = {
    username: 'Alan Bradley',
    password: 'tronlives',
  };
  const user: User = {
    email: 'alan.bradley@example.com',
    id: '00000000-0000-0000-0000-000000000000',
    role: 'user',
    slug: 'alan-bradley',
    username: 'Alan Bradley',
  };
  const token = '12345';
  const success: FetchResponse<{ token: string, user: User }> = {
    data: {
      ok: true,
      data: {
        token,
        user,
      },
    },
  };
  const failure: FetchResponse = {
    error: {
      status: 500,
      data: {
        ok: false,
        error: {
          message: 'Something went wrong',
        },
      },
    },
  };

  describe('createSession()', () => {
    const actionCreator = actions.create;

    it('should return a function', () => {
      const dispatch = jest.fn();
      const middleware = createSession({ actionCreator, dispatch });

      expect(typeof middleware).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = createSession;
      const expected = {
        name: 'sessions:createSession',
        type: 'middleware',
      };

      expect(annotations).toEqual(expected);
    });

    it('should call the next function', async () => {
      const dispatch = jest.fn();
      const middleware = createSession({ actionCreator, dispatch });
      const next = jest.fn(() => Promise.resolve(success));

      await middleware(next, login);

      expect(next).toHaveBeenCalledWith(login);
    });

    describe('with a failing response', () => {
      it('should not dispatch an action', async () => {
        const dispatch = jest.fn();
        const middleware = createSession({ actionCreator, dispatch });
        const next = jest.fn(() => Promise.resolve(failure));

        await middleware(next, login);

        expect(dispatch).not.toHaveBeenCalled();
      });
    });

    describe('with a passing response', () => {
      it('should dispatch a create action', async () => {
        const dispatch = jest.fn();
        const middleware = createSession({ actionCreator, dispatch });
        const next = jest.fn(() => Promise.resolve(success));
        const action = actions.create({ token, user });

        await middleware(next, login);

        expect(dispatch).toHaveBeenCalledWith(action);
      });
    });
  });

  describe('storeSession()', () => {
    it('should return a function', () => {
      const setItem: jest.MockedFunction<SetItem> = jest.fn();
      const middleware = storeSession({ setItem });

      expect(typeof middleware).toBe('function');
    });

    it('should be annotated', () => {
      const { annotations } = storeSession;
      const expected = {
        name: 'sessions:storeSession',
        type: 'middleware',
      };

      expect(annotations).toEqual(expected);
    });

    it('should call the next function', async () => {
      const setItem: jest.MockedFunction<SetItem> = jest.fn();
      const middleware = storeSession({ setItem });
      const next = jest.fn(() => Promise.resolve(success));

      await middleware(next, login);

      expect(next).toHaveBeenCalledWith(login);
    });

    describe('with a failing response', () => {
      it('should not store the session', async () => {
        const setItem: jest.MockedFunction<SetItem> = jest.fn();
        const middleware = storeSession({ setItem });
        const next = jest.fn(() => Promise.resolve(failure));

        await middleware(next, login);

        expect(setItem).not.toHaveBeenCalled();
      });
    });

    describe('with a passing response', () => {
      it('should store the session', async () => {
        const setItem: jest.MockedFunction<SetItem> = jest.fn();
        const middleware = storeSession({ setItem });
        const next = jest.fn(() => Promise.resolve(success));
        const session: Session = {
          authenticated: true,
          token,
          user,
        };
        const value = JSON.stringify(session);

        await middleware(next, login);

        expect(setItem).toHaveBeenCalledWith('session', value);
      });
    });
  });
});
