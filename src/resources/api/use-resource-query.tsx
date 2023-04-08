import { useApiQuery } from '@api/request';
import type {
  AlertDirective,
  RefetchOptions,
  UseRequestConfig,
} from '@api/request';
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
  scope?: string,
  singularName?: string,
  url?: string,
};

export const useResourceQuery = ({
  action,
  alerts,
  baseUrl,
  member,
  resourceName,
  scope,
  singularName,
  url,
  ...rest
}: UseResourceQueryOptions) => {
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
    url: configuredUrl,
    ...rest,
  });
};
