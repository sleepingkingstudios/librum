import type { Response } from '@api';
import type { Button } from '@components/button/types';
import type {
  Breadcrumb,
  NavigationProps,
} from '@components/page';
import type { ResourceConfiguration } from '@resources/types';

type PageContents = {
  afterContents?: JSX.Element | React.ComponentType,
  beforeContents?: JSX.Element | React.ComponentType,
  contents?: JSX.Element | React.ComponentType,
};

type PageOptions = {
  breadcrumbs?: JSX.Element | Breadcrumb[],
  buttons?: Button[],
  heading?: string | JSX.Element,
  member?: boolean,
  navigation?: JSX.Element | NavigationProps,
  subtitle?: string,
  title?: string,
} & Record<string, unknown>;

export type ResourcePageOptions = PageContents & PageOptions;

export type ResourcePageProps = {
  action: string,
  page: ResourcePageOptions,
  response?: Response,
} & ResourceConfiguration;
