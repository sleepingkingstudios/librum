import type { ApiSuccess } from '@api';
import type {
  Session,
  User,
} from '@session';
import type {
  Action,
  ActionCreator,
  Dispatch,
} from '@store';
import type { Annotated } from '@utils/annotations';
import type { SessionMiddleware } from './types';

type CreateSession = (
  (
    { createSession, dispatch }: {
      createSession: ActionCreator<
        { token: string, user: User },
        Session
      >,
      dispatch: Dispatch,
    }
  ) => SessionMiddleware
) & Annotated;

const createSession: CreateSession = ({ createSession, dispatch }) => {
  const middleware: SessionMiddleware = async (fn, login) => {
    const result = await fn(login);

    if ('error' in result) { return result; }

    const response: ApiSuccess<{ token: string, user: User }> = result.data;
    const { token, user } = response.data;
    const action: Action<Session> = createSession({ token, user });

    dispatch(action);

    return result;
  };

  return middleware;
};

createSession.annotations = {
  name: 'sessions:createSession',
  type: 'middleware',
};

export { createSession };
