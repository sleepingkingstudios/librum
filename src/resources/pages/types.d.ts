import type { UseQuery } from '@api';
import type {
  Breadcrumb,
  NavigationProps,
} from '@components/page';
import type { DataTableType } from '@resources/components/table';

type ResourceConfiguration = {
  resourceName: string,
  scope?: string,
  singularName?: string,
};

type ResourcePageProps = {
  breadcrumbs?: JSX.Element | Breadcrumb[],
  navigation?: JSX.Element | NavigationProps,
  subtitle?: string,
  title?: string,
};

type ResourceRequestProps = {
  alerts?: false | AlertDirective[],
  effects?: Effect[],
  useQuery: UseQuery,
};

type ResourceSharedProps =
  ResourceConfiguration & ResourcePageProps & ResourceRequestProps;

export type ResourceIndexPageProps = {
  Table: DataTableType,
} & ResourceSharedProps;
