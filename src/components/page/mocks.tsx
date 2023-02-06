import * as React from 'react';

import type {
  Breadcrumb,
  NavigationProps,
} from './index';
import { isElement } from '@utils/react-utils';
import { PageBreadcrumbs } from './breadcrumbs/mocks';
import { PageNavigation } from './navigation/mocks';

const renderBreadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs?: JSX.Element | Breadcrumb[],
}): JSX.Element => {
  if (!breadcrumbs) { return null; }

  if (isElement(breadcrumbs)) { return breadcrumbs; }

  const configured = breadcrumbs as Breadcrumb[];

  if (configured.length === 0) { return null; }

  return (<PageBreadcrumbs breadcrumbs={configured} />);
};

const renderNavigation = ({
  navigation,
}: {
  navigation: JSX.Element | NavigationProps,
}): JSX.Element => {
  if (!navigation) { return null; }

  if (!('length' in navigation)) { return navigation; }

  if (navigation.length === 0) { return null; }

  return (<PageNavigation navigation={navigation} />);
};

const renderTitle = ({
  subtitle,
  title,
}: {
  subtitle?: string,
  title?: string,
}): JSX.Element => {
  if (!title || title.length === 0) { return null; }

  if (!subtitle || subtitle.length === 0) {
    return (<span aria-label="title">{ title }</span>);
  }

  return (<span aria-label="title">{ `${title}: ${subtitle}` }</span>);
};

export const Page = ({
  breadcrumbs,
  children,
  navigation,
  subtitle,
  title,
}: {
  breadcrumbs?: JSX.Element | Breadcrumb[],
  children: React.ReactNode,
  navigation?: JSX.Element | NavigationProps,
  subtitle?: string,
  title?: string,
}): JSX.Element => {
  return (
    <div className="mock-page">
      { renderTitle({ subtitle, title }) }

      { renderNavigation({ navigation }) }

      { children }

      { renderBreadcrumbs({ breadcrumbs }) }
    </div>
  );
};
