import * as React from 'react';

import { PageBreadcrumb } from './breadcrumb';
import type { Breadcrumb } from './types';

export type { Breadcrumb } from './types';

export const PageBreadcrumbs = (
  { breadcrumbs }: { breadcrumbs: Breadcrumb[] }
): JSX.Element => {
  if (breadcrumbs.length === 0) { return null; }

  return (
    <ul className="flex flex-col sm:flex-row page-breadcrumbs">
      {
        breadcrumbs.map((breadcrumb: Breadcrumb): JSX.Element => {
          const { label } = breadcrumb;

          return (
            <PageBreadcrumb key={label} breadcrumb={breadcrumb} />
          );
        })
      }
    </ul>
  )
};
