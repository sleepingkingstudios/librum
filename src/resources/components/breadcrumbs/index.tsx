import * as React from 'react';

import { kebabCase } from 'lodash';
import { useParams } from 'react-router-dom';

import { applyWildcards } from '@api/utils';
import type { Breadcrumb } from '@components/page';
import { PageBreadcrumbs } from '@components/page/breadcrumbs';
import { titleCase } from '@utils/text';

const generatePageBreadcrumbs = ({
  action,
  member,
  page,
  resourceBreadcrumbs,
  resourceName,
}: {
  action: string,
  member: boolean,
  page: {
    breadcrumbs?: Breadcrumb[],
  },
  resourceBreadcrumbs: Breadcrumb[],
  resourceName: string,
}): Breadcrumb[] => {
  if (page.breadcrumbs) {
    return [...resourceBreadcrumbs, ...page.breadcrumbs];
  }

  const resourceUrl = joinUrl(
    lastUrl(resourceBreadcrumbs),
    kebabCase(resourceName),
  );
  const breadcrumbs = [...resourceBreadcrumbs];

  breadcrumbs.push({
    label: titleCase(resourceName),
    url: resourceUrl,
  });

  if (member) {
    // @TODO
  } else {
    breadcrumbs.push({
      active: true,
      label: titleCase(action),
    });
  }

  return breadcrumbs;
};

const generateResourceBreadcrumbs = ({
  breadcrumbs,
  scope,
}: {
  breadcrumbs?: Breadcrumb[],
  scope?: string,
}): Breadcrumb[] => {
  if (breadcrumbs) { return breadcrumbs; }

  const prefix: Breadcrumb[] = [
    {
      label: 'Home',
      url: '/',
    },
  ];

  if (!(scope && scope.length > 0)) { return prefix; }

  scope.split('/').forEach((segment: string) => {
    const previous: Breadcrumb = prefix[prefix.length - 1];
    const { url } = previous;

    prefix.push({
      label: titleCase(segment),
      url: joinUrl(url, kebabCase(segment)),
    });
  });

  return prefix;
};

const joinUrl = (prefix: string, suffix: string): string => {
  if (prefix[prefix.length - 1] === '/') {
    return `${prefix}${suffix}`;
  }

  return `${prefix}/${suffix}`;
};

const lastUrl = (breadcrumbs: Breadcrumb[]): string => {
  if (breadcrumbs.length === 0) { return '/'; }

  return breadcrumbs.reduce(
    (memo: string, breadcrumb: Breadcrumb) => {
      const { url } = breadcrumb;

      return url ? url : memo;
    },
    '/',
  );
};

export const ResourceBreadcrumbs = ({
  action,
  breadcrumbs,
  member,
  page,
  resourceName,
  scope,
  wildcards,
}: {
  action: string,
  breadcrumbs?: Breadcrumb[],
  member: boolean,
  page: { breadcrumbs?: Breadcrumb[] },
  resourceName: string,
  scope?: string,
  wildcards?: Record<string, string>,
}): JSX.Element => {
  const resourceBreadcrumbs: Breadcrumb[] =
    generateResourceBreadcrumbs({ breadcrumbs, scope });
  const pageBreadcrumbs: Breadcrumb[] =
    generatePageBreadcrumbs({
      action,
      member,
      page,
      resourceBreadcrumbs,
      resourceName,
    });
  const params = useParams();

  const appliedBreadcrumbs: Breadcrumb[] = pageBreadcrumbs.map(
    (breadcrumb: Breadcrumb): Breadcrumb => {
      if (!('url' in breadcrumb)) { return breadcrumb; }

      return {
        ...breadcrumb,
        url: applyWildcards({
          url: breadcrumb.url,
          wildcards: { ...params, ...wildcards },
        }),
      };
    }
  );

  return (<PageBreadcrumbs breadcrumbs={appliedBreadcrumbs} />);
};
