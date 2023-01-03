import type {
  Effect,
  Response,
  UseQuery,
} from '@api';
import type { AlertDirective } from '@api/effects/display-alerts';

export type ResourceApiParams = {
  endpoints?: Record<string, false | ResourceEndpointDefinition>,
} & ResourceApiProperties;

export type ResourceApiProperties = {
  baseUrl?: string,
  resourceName: string,
  scope?: string,
  singularName?: string,
};

export type ResourceEndpointDefinition = {
  member: boolean,
  method?: string,
  url?: string,
};

export type ResourceEndpointProperties = {
  action: string,
  endpoint: ResourceEndpointDefinition,
} & ResourceApiProperties;

export type ResourceMutationParams = {
  body?: Record<string, unknown>,
  params?: Record<string, string>,
  wildcards?: Record<string, string>,
};

export type ResourceQueryParams = {
  params?: Record<string, string>,
  wildcards?: Record<string, string>,
};

export type UseResourceQuery = (arg?: ResourceQueryParams) => Response;

export type UseResourceQueryProps = {
  action: string,
  alerts?: false | AlertDirective[],
  effects?: Effect[],
  member: boolean,
  resourceName: string,
  scope?: string,
  singularName?: string,
  useQuery: UseQuery,
};
