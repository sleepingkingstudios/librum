import { useNavigate } from "react-router-dom";

import { useApiQuery } from '@api';
import type {
  AlertDirective,
  Middleware,
  RefetchOptions,
  UseRequestConfig,
} from '@api';
import { handleNotFoundMiddleware } from './middleware';
import {
  generateAlerts,
  generateUrl,
} from './utils';

export type UseResourceQueryOptions = UseRequestConfig & RefetchOptions & {
  action: string,
  alerts?: AlertDirective[],
  baseUrl?: string,
  member: boolean,
  resourceName: string,
  route?: string,
  scope?: string,
  singularName?: string,
  url?: string,
};

const generateMiddleware = ({
  action,
  member,
  middleware = [],
  resourceName,
  route,
  scope,
  singularName,
}: {
  action: string,
  member: boolean,
  middleware: Middleware[],
  resourceName: string,
  route?: string,
  scope?: string,
  singularName?: string,
}): Middleware[] => {
  if (!member) { return middleware; }

  return [
    handleNotFoundMiddleware({
      action,
      member,
      resourceName,
      route,
      scope,
      singularName,
    }),
    ...middleware,
  ];
};

export const useResourceQuery = ({
  action,
  alerts,
  baseUrl,
  config,
  member,
  middleware,
  resourceName,
  route,
  scope,
  singularName,
  url,
  ...rest
}: UseResourceQueryOptions) => {
  const navigate = useNavigate();
  const configuredAlerts: AlertDirective[] = generateAlerts({
    action,
    alerts,
    member,
    query: true,
    resourceName,
    singularName,
  });
  const configuredUrl = generateUrl({
    action,
    baseUrl,
    member,
    resourceName,
    scope,
    url,
  });

  return useApiQuery({
    alerts: configuredAlerts,
    config: {
      navigate,
      ...config,
    },
    middleware: generateMiddleware({
      action,
      member,
      middleware,
      resourceName,
      route,
      scope,
      singularName,
    }),
    url: configuredUrl,
    ...rest,
  });
};
