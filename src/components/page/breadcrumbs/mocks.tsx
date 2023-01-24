import * as React from 'react';

import type { Breadcrumb } from './types';

const formatBreadcrumb = (breadcrumb: Breadcrumb): string => {
  const { active, label, url } = breadcrumb;

  return `${label}${url ? ` @ ${url}` : ''}${active ? ' (active)' : ''}`;
};

export const PageBreadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[],
}): JSX.Element => (
  <ul aria-label="breadcrumbs">
    {
      breadcrumbs.map((breadcrumb: Breadcrumb) => (
        <li aria-label="breadcrumb" key={breadcrumb.label}>
          { formatBreadcrumb(breadcrumb) }
        </li>
      ))
    }
  </ul>
);
