import * as React from 'react';

import { PageBreadcrumbs } from '../breadcrumbs';
import type { Breadcrumb } from '../breadcrumbs';

const defaultClassName = 'mt-3 shrink-0 text-center sm:text-left';

const renderBreadcrumbs = ({
  breadcrumbs = [],
}: {
  breadcrumbs?: Breadcrumb[] | JSX.Element,
}): JSX.Element => {
  if (!breadcrumbs) { return null; }

  if (!('length' in breadcrumbs)) { return breadcrumbs; }

  return (<PageBreadcrumbs breadcrumbs={breadcrumbs} />);
};

export const PageFooter = ({
  breadcrumbs = [],
}: {
  breadcrumbs?: Breadcrumb[] | JSX.Element,
}): JSX.Element => (
  <footer className={defaultClassName}>
    { renderBreadcrumbs({ breadcrumbs }) }

    <hr className="hr-fancy mb-2" />

    <span className="text-muted">
      What lies beyond the furthest reaches of the sky?
    </span>
  </footer>
);
