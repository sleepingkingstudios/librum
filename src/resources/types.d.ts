import type {
  UseMutation,
  UseQuery,
} from '@api';
import type {
  Breadcrumb,
  NavigationProps,
} from '@components/page';
import type { ResourcePageOptions } from '@resources/components/page';
import type { DataTableType } from './data-table/types';

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
  navigation?: JSX.Element | NavigationProps,
  resourceName: string,
  route?: string,
  scope?: string,
  singularName?: string,
  subtitle?: string,
  title?: string,
};

export type ResourcePageComponent = React.ComponentType<ResourcePageProps>;

export type ResourcePageRouteOptions = {
  member?: boolean,
  route?: string,
};

export type ResourcePageWithRoute = {
  Page: React.ComponentType,
} & ResourcePageRouteOptions;

export type ResourcePagesConfiguration = Record<
  string,
  false |
    (ResourcePageOptions & ResourcePageRouteOptions) |
    ResourcePageWithRoute
>;

export type ResourceProps = {
  endpoints?: ResourceApiEndpointConfiguration,
  pages?: ResourcePagesConfiguration,
} & ResourceConfiguration;

export type ResourceRoutesProps = {
  Pages: Record<string, ResourcePageComponent>,
  pages?: ResourcePagesConfiguration,
} & ResourceConfiguration;