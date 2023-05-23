import { useAlerts } from '@alerts';
import {
  alertsMiddleware,
  apiDataMiddleware,
  authenticationMiddleware,
} from '../middleware';
import { selector as selectSession } from '@session';
import {
  useDispatch,
  useSelector,
} from '@store';
import type {
  Middleware,
  MiddlewareOptions,
  Refetch,
  Response,
  UseApiRequest,
  UseApiRequestOptions,
} from '../types';
import { useRequest } from './use-request';

const buildMiddleware = (options: UseApiRequestOptions): Middleware[] => {
  const { alerts } = options;
  const configured: Middleware[] = options.middleware || [];
  const middleware: Middleware[] = [
    apiDataMiddleware,
    authenticationMiddleware,
  ];

  if (alerts) { middleware.push(alertsMiddleware(alerts)); }

  return [...middleware, ...configured];
};

const buildUrl = (url: string): string => {
  const apiUrl = process.env.API_URL.replace(/\/$/, '');
  const configured = url.replace(/^\//, '');

  return `${apiUrl}/${configured}`;
};

export const useApiRequest: UseApiRequest =
  (options: UseApiRequestOptions): [Response, Refetch] => {
    const alertsContext = useAlerts();
    const dispatch = useDispatch();
    const session = useSelector(selectSession);
    const config: MiddlewareOptions = {
      alerts: alertsContext,
      dispatch,
      session,
      ...(options.config || {}),
    };
    const middleware: Middleware[] = buildMiddleware(options);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { alerts, url, ...rest } = options;

    return useRequest({
      ...rest,
      config,
      middleware,
      url: buildUrl(url),
    });
  };
