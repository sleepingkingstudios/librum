import * as React from 'react';

import type {
  Breadcrumb,
  Breadcrumbs,
  NavigationProps,
} from './index';
import { PageNavigation } from './navigation/mocks';

const renderBreadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumbs,
}): JSX.Element => {
  if (!breadcrumbs || breadcrumbs.length === 0) { return null; }

  return (
    <ul aria-label="breadcrumbs">
      {
        breadcrumbs.map((breadcrumb: Breadcrumb) => (
          <li key={breadcrumb.label}>
            { breadcrumb.label }

            { breadcrumb.url ? `@ ${breadcrumb.url}` : null }

            { breadcrumb.active ? '(active)' : null }
          </li>
        ))
      }
    </ul>
  );
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
  breadcrumbs?: Breadcrumbs,
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
