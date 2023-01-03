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

export const Page = ({
  breadcrumbs,
  children,
  navigation,
}: {
  breadcrumbs?: Breadcrumbs,
  children: React.ReactNode,
  navigation?: JSX.Element | NavigationProps,
}): JSX.Element => {
  return (
    <div className="mock-page">
      { renderNavigation({ navigation }) }

      { children }

      { renderBreadcrumbs({ breadcrumbs }) }
    </div>
  );
};
