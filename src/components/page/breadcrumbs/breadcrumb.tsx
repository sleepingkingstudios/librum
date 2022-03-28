import * as React from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import type { Breadcrumb } from './types';

const EmptyBreadcrumb = ({ label }: { label: string }): JSX.Element => (
  <li className="page-breadcrumb">
    <span className="page-breadcrumb-empty">{ label }</span>
  </li>
);

const BreadcrumbLink = (
  { label, url }: { label: string, url: string }
): JSX.Element => (
  <li className="page-breadcrumb">
    <Link to={url} className="page-breadcrumb-link">{ label }</Link>
  </li>
)

export const PageBreadcrumb = (
  { breadcrumb }: { breadcrumb: Breadcrumb }
): JSX.Element => {
  const { active, label } = breadcrumb;
  const { pathname } = useLocation();

  if (!('url' in breadcrumb) || active === false) {
    return (<EmptyBreadcrumb label={label} />);
  }

  const { url } = breadcrumb;

  if (active !== true && pathname === url) {
    return (<EmptyBreadcrumb label={label} />);
  }

  return (<BreadcrumbLink label={label} url={url} />);
};
