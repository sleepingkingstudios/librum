import { faUserClock } from '@fortawesome/free-solid-svg-icons';

import { useAlerts } from '@alerts';
import type { AlertsContext } from '@alerts/types';
import { expiredSessionError } from '@api/errors';
import {
  actions as sessionActions,
  selector as selectSession,
} from '@session';
import type { Session } from '@session';
import { clearStoredSession } from '@session/utils';
import {
  useDispatch,
  useSelector,
} from '@store';
import type { Dispatch } from '@store';
import type {
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  RequestHeaders,
  RequestOptions,
  Response,
  ResponseData,
} from '../types';

const authenticateOptions =
  (options: RequestOptions, session: Session): RequestOptions => {
    const { authenticated, token } = session;

    if (!authenticated) { return options; }

    if (token === null || token === undefined || token.length === 0) {
      return options;
    }

    const headers: RequestHeaders = {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    return { ...options, headers };
  };

const defaultSession: Session = { authenticated: false };

const handleAuthenticationError = ({
  alerts,
  dispatch,
}: {
  alerts: AlertsContext,
  dispatch: Dispatch,
}): void => {
  const { displayAlert } = alerts;

  dispatch(sessionActions.destroy());

  clearStoredSession();

  displayAlert({
    context: 'authentication:session',
    icon: faUserClock,
    message: 'Your login session has expired',
    type: 'warning',
  });
};

const isAuthenticationError = (error: ResponseData): boolean => {
  if (error === undefined || error === null) { return false; }

  if (typeof error === 'string') { return false; }

  if (!('type' in error)) { return false; }

  const { type } = error;

  return type === expiredSessionError;
};

export const authenticationMiddleware: Middleware =
  (fn: PerformRequest, config: MiddlewareOptions): PerformRequest => {
    const alerts = config.alerts as AlertsContext;
    const dispatch = config.dispatch as Dispatch;
    const session = (config.session || defaultSession) as Session;

    return (url: string, options: RequestOptions = {}): Promise<Response> => {
      return fn(url, authenticateOptions(options, session))
        .then((response: Response) => {
          if (!isAuthenticationError(response.error)) { return response; }

          handleAuthenticationError({ alerts, dispatch });

          return {
            ...response,
            meta: { ...response.meta, alerted: true },
          };
        });
    };
  };

export const useAuthenticationMiddleware = (): Middleware => {
  const alerts: AlertsContext = useAlerts();
  const dispatch: Dispatch = useDispatch();
  const session = useSelector(selectSession);

  return (fn: PerformRequest, config: MiddlewareOptions): PerformRequest => (
    authenticationMiddleware(fn, {
      alerts,
      dispatch,
      session,
      ...config,
    })
  );
};
