import type {
  UseMutation,
  UseQuery,
} from '@api';
import type { Breadcrumb } from '@components/page';
import type { DataTableType } from './data-table/types';
import type { ResourcePageProps } from './pages';

export type {
  ResourceMutationParams,
  ResourceQueryParams,
  UseResourceQuery,
} from './api/types';

export type ResourceApi = Record<string, UseMutation | UseQuery>;

export type ResourceApiEndpoint = {
  action: string,
} & ResourceApiEndpointOptions;

export type ResourceApiEndpointOptions = {
  member: boolean,
  method?: string,
  url?: string,
};

export type ResourceApiEndpointConfiguration =
  Record<string, false | ResourceApiEndpointOptions>;

export type ResourceConfiguration = {
  Table?: DataTableType,
  baseUrl?: string,
  breadcrumbs?: Breadcrumb[],
  resourceName: string,
  scope?: string,
  singularName?: string,
};

export type ResourcePagesConfiguration =
  Record<string, false | ResourcePageProps>;

export type ResourceProps = {
  endpoints?: ResourceApiEndpointConfiguration,
  pages?: ResourcePagesConfiguration,
} & ResourceConfiguration;
