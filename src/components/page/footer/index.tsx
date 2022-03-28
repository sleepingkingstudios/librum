import * as React from 'react';

import { PageBreadcrumbs } from '../breadcrumbs';
import type { Breadcrumbs } from '../breadcrumbs';

const defaultClassName = 'mt-3 shrink-0 text-center sm:text-left';

export const PageFooter = (
  { breadcrumbs = [] }: { breadcrumbs?: Breadcrumbs }
): JSX.Element => (
  <footer className={defaultClassName}>
    <PageBreadcrumbs breadcrumbs={breadcrumbs} />

    <hr className="hr-fancy mb-2" />

    <span className="text-muted">
      What lies beyond the furthest reaches of the sky?
    </span>
  </footer>
);
