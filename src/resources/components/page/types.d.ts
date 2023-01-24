import type { Effect } from '@api';
import type { AlertDirective } from '@api/effects/display-alerts';
import type { Button } from '@components/button/types';
import type {
  Breadcrumb,
  NavigationProps,
} from '@components/page';
import type { ResourceApiHooks } from '../../api/types';
import type { ResourceConfiguration } from '../../types';

type PageContents = {
  afterContents?: JSX.Element | React.ComponentType,
  beforeContents?: JSX.Element | React.ComponentType,
  contents?: JSX.Element | React.ComponentType,
};

type PageOptions = {
  breadcrumbs?: JSX.Element | Breadcrumb[],
  buttons?: Button[],
  heading?: string | JSX.Element,
  navigation?: JSX.Element | NavigationProps,
  subtitle?: string,
  title?: string,
} & Record<string, unknown>;

type RequestOptions = {
  alerts?: false | AlertDirective[],
  effects?: Effect[],
};

export type ResourcePageOptions = PageContents & PageOptions & RequestOptions;

export type ResourcePageProps = {
  action: string,
  apiHooks: ResourceApiHooks,
  member: boolean,
  page: ResourcePageOptions,
} & ResourceConfiguration;
