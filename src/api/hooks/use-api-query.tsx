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
  UseApiQuery,
  UseApiQueryOptions,
} from '../types';
import { useQuery } from './use-query';

const buildMiddleware = (options: UseApiQueryOptions): Middleware[] => {
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

export const useApiQuery: UseApiQuery =
  (options: UseApiQueryOptions): [Response, Refetch] => {
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

    return useQuery({
      ...rest,
      config,
      middleware,
      url: buildUrl(url),
    });
  };
