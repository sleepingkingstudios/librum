export type {
  ResourceMutationParams,
  ResourceQueryParams,
  UseResourceQuery,
} from './api/types';

type ResourceApiEndpointAnonymous = {
  member: boolean,
  method?: string,
  url?: string,
};

export type ResourceApiEndpoint = {
  action: string,
} & ResourceApiEndpointAnonymous;

export type ResourceApiEndpointConfiguration =
  Record<string, false | ResourceApiEndpointAnonymous>;

export type ResourceConfiguration = {
  baseUrl?: string,
  resourceName: string,
  scope?: string,
  singularName?: string,
};

export type ResourceProps = {
  endpoints?: ResourceApiEndpointConfiguration,
} & ResourceConfiguration;
