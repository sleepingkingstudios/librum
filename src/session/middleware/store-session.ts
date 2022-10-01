import type { ApiSuccess } from '@api';
import type {
  Session,
  User,
} from '@session';
import type { Annotated } from '@utils/annotations';
import type { SessionMiddleware } from './types';

type SetItem = (key: string, value: unknown) => unknown;

type StoreSession = (
  ({ setItem }: { setItem: SetItem }) => SessionMiddleware
) & Annotated;

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

export { storeSession };
