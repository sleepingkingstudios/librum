import type { User } from '@session';
import type { Login } from '@session/api';
import { actions } from '@session/reducer';
import type { FetchResponse } from '@store/api';

import { createSession } from './middleware';

describe('Session middleware', () => {
  describe('createSession()', () => {
    const actionCreator = actions.create;
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
    const response: FetchResponse<{ token: string, user: User }> = {
      data: {
        ok: true,
        data: {
          token,
          user,
        },
      },
    };

    it('should return a function', () => {
      const dispatch = jest.fn();
      const middleware = createSession({ actionCreator, dispatch });

      expect(typeof middleware).toBe('function');
    });

    it('should call the next function', async () => {
      const dispatch = jest.fn();
      const middleware = createSession({ actionCreator, dispatch });
      const next = jest.fn(() => Promise.resolve(response));

      await middleware(next, login);

      expect(next).toHaveBeenCalledWith(login);
    });

    describe('with a failing response', () => {
      const failure = {
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
        const next = jest.fn(() => Promise.resolve(response));
        const action = actions.create({ token, user });

        await middleware(next, login);

        expect(dispatch).toHaveBeenCalledWith(action);
      });
    });
  });
});
