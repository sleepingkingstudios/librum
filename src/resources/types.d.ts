import type {
  Breadcrumb,
  NavigationProps,
} from '@components/page';
import type { ResourcePageOptions } from '@resources/components/page';
import type { DataTableData } from './data-table';

export type ConfiguredDataBlock =
  (props: ConfiguredDataBlockProps) => JSX.Element;

export type ConfiguredDataBlockProps = {
  data: DataBlockData,
  name: string,
};

export type ConfiguredDataTable =
  (props: ConfiguredDataTableProps) => JSX.Element;

export type ConfiguredDataTableProps = {
  data: DataTableData,
  name: string,
};

export type DataBlockData = Record<string, Record<string, unknown>>;

export type ResourceConfiguration = {
  Block?: ConfiguredDataBlock,
  Table?: ConfiguredDataTable,
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
  pages?: ResourcePagesConfiguration,
} & ResourceConfiguration;

export type ResourceRoutesProps = {
  Pages: Record<string, ResourcePageComponent>,
  pages?: ResourcePagesConfiguration,
} & ResourceConfiguration;
