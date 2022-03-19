import type {
  Session,
  User,
} from '@session';
import type { Login } from '@session/api';
import type {
  Action,
  ActionCreator,
  Dispatch,
} from '@store';
import type {
  ApiSuccess,
  FetchResponse,
} from '@store/api';
import type { Middleware } from '@utils/middleware';

type CreateSessionMiddleware = Middleware<
  Login,
  Promise<
    FetchResponse<{ token: string, user: User }>
  >
>;

type CreateSession = (
  { actionCreator, dispatch }: {
    actionCreator: ActionCreator<
      { token: string, user: User },
      Session
    >,
    dispatch: Dispatch,
  }
) => CreateSessionMiddleware;

export const createSession: CreateSession = ({ actionCreator, dispatch }) => {
  const middleware: CreateSessionMiddleware =
    async (fn, login) => {
      const result = await fn(login);

      if ('error' in result) { return result; }

      const response: ApiSuccess<{ token: string, user: User }> = result.data;
      const { token, user } = response.data;
      const action: Action<Session> = actionCreator({ token, user });

      dispatch(action);

      return result;
    };

  return middleware;
};
