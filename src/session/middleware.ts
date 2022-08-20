import type {
  ApiSuccess,
  FetchResponse,
} from '@api';
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
import type { Annotated } from '@utils/annotations';
import type { Middleware } from '@utils/middleware';

type SessionMiddleware = Middleware<
  Login,
  Promise<
    FetchResponse<{ token: string, user: User }>
  >
>;

type CreateSession = (
  (
    { actionCreator, dispatch }: {
      actionCreator: ActionCreator<
        { token: string, user: User },
        Session
      >,
      dispatch: Dispatch,
    }
  ) => SessionMiddleware
) & Annotated;

type SetItem = (key: string, value: unknown) => unknown;

type StoreSession = (
  ({ setItem }: { setItem: SetItem }) => SessionMiddleware
) & Annotated;

const createSession: CreateSession = ({ actionCreator, dispatch }) => {
  const middleware: SessionMiddleware = async (fn, login) => {
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

createSession.annotations = {
  name: 'sessions:createSession',
  type: 'middleware',
};

const storeSession: StoreSession = ({ setItem }) => {
  const middleware: SessionMiddleware = async (fn, login) => {
    const result = await fn(login);

    if ('error' in result) { return result; }

    const response: ApiSuccess<{ token: string, user: User }> = result.data;
    const { token, user } = response.data;
    const session: Session = {
      authenticated: true,
      token,
      user,
    };
    const value = JSON.stringify(session);

    setItem('session', value);

    return result;
  };

  return middleware;
};

storeSession.annotations = {
  name: 'sessions:storeSession',
  type: 'middleware',
};

export {
  createSession,
  storeSession,
};
