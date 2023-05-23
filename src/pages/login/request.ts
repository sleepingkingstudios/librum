import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

import { useApiRequest } from '@api';
import type {
  AlertDirective,
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  RequestOptions,
  Response,
  ResponseData,
} from '@api';
import type {
  Session,
  User,
} from '@session';
import { actions as sessionActions } from '@session/reducer';
import {
  clearStoredSession,
  setStoredSession,
} from '@session/utils';
import type {
  Action,
  Dispatch,
} from '@store';

const buildSession = (data: ResponseData): Session => {
  if (data === null || data === undefined) { return { authenticated: false }; }

  if (typeof data === 'string') { return { authenticated: false }; }

  if (!('token' in data && 'user' in data)) { return { authenticated: false }; }

  const token = data.token as string;
  const user = data.user as User;

  return {
    authenticated: true,
    token,
    user,
  };
};
const loginAlerts: AlertDirective[] = [
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

export const createSessionMiddleware: Middleware =
  (fn: PerformRequest, config: MiddlewareOptions): PerformRequest => {
    const dispatch = config.dispatch as Dispatch;
    const { create, destroy } = sessionActions;

    return async (url: string, options?: RequestOptions): Promise<Response> => {
      const response = await fn(url, options);
      const { data, isSuccess } = response;

      if (!isSuccess) { return response; }

      const session: Session = buildSession(data);
      const { authenticated, token, user } = session;

      if (authenticated) {
        const action: Action<Session> = create({ token, user });

        dispatch(action);

        setStoredSession(session);
      } else {
        const action: Action<Session> = destroy();

        dispatch(action);

        clearStoredSession();
      }

      return response;
    };
  };

export const useLoginRequest = () => {
  return useApiRequest({
    alerts: loginAlerts,
    method: 'post',
    middleware: [
      createSessionMiddleware,
    ],
    url: '/api/authentication/session',
  });
};
