import * as React from 'react';
import { isPlainObject } from 'lodash';

import { kebabCase } from 'lodash';
import { useParams } from 'react-router-dom';

import { applyWildcards } from '@api/utils';
import type { Breadcrumb } from '@components/page';
import { PageBreadcrumbs } from '@components/page/breadcrumbs';
import { singularize } from '@utils/inflector';
import { titleCase } from '@utils/text';

const generateCollectionBreadcrumbs = ({
  action,
  resourceBreadcrumbs,
  resourceName,
}: {
  action: string,
  resourceBreadcrumbs: Breadcrumb[],
  resourceName: string,
}): Breadcrumb[] => {
  if (action === '') {
    return [
      {
        label: titleCase(resourceName),
        active: true,
      },
    ];
  }

  const resourceUrl = joinUrl(
    lastUrl(resourceBreadcrumbs),
    kebabCase(resourceName),
  );

  return [
    {
      label: titleCase(resourceName),
      url: resourceUrl,
    },
    {
      active: true,
      label: titleCase(action),
    },
  ];
};

const generateMemberBreadcrumbs = ({
  action,
  data,
  resourceBreadcrumbs,
  resourceName,
  singularName,
  status,
}: {
  action: string,
  data: Record<string, unknown>,
  resourceBreadcrumbs: Breadcrumb[],
  resourceName: string,
  singularName?: string,
  status: string,
}): Breadcrumb[] => {
  const resourceUrl = joinUrl(
    lastUrl(resourceBreadcrumbs),
    kebabCase(resourceName),
  );
  const breadcrumbs: Breadcrumb[] = [
    {
      label: titleCase(resourceName),
      url: resourceUrl,
    },
  ];

  if (action === '') {
    if (status !== 'success') {
      return [
        ...breadcrumbs,
        {
          label: 'Loading',
          active: true,
        },
      ];
    }

    return [
      ...breadcrumbs,
      memberBreadcrumbFor({
        active: true,
        data,
        resourceName,
        resourceUrl,
        singularName,
      }),
    ];
  }

  if (status !== 'success') {
    return [
      ...breadcrumbs,
      {
        label: 'Loading',
      },
      {
        label: titleCase(action),
        active: true,
      },
    ];
  }

  return [
    ...breadcrumbs,
    memberBreadcrumbFor({
      active: false,
      data,
      resourceName,
      resourceUrl,
      singularName,
    }),
    {
      label: titleCase(action),
      active: true,
    }
  ];
};

const generatePageBreadcrumbs = ({
  action,
  data,
  page,
  resourceBreadcrumbs,
  resourceName,
  singularName,
  status,
}: {
  action: string,
  data: Record<string, unknown>,
  page: {
    breadcrumbs?: Breadcrumb[],
    member?: boolean,
  },
  resourceBreadcrumbs: Breadcrumb[],
  resourceName: string,
  singularName?: string,
  status: string,
}): Breadcrumb[] => {
  if (page.breadcrumbs) {
    return [...resourceBreadcrumbs, ...page.breadcrumbs];
  }

  let breadcrumbs: Breadcrumb[];

  if (page.member) {
    breadcrumbs = generateMemberBreadcrumbs({
      action,
      data,
      resourceBreadcrumbs,
      resourceName,
      singularName,
      status,
    });
  } else {
    breadcrumbs = generateCollectionBreadcrumbs({
      action,
      resourceBreadcrumbs,
      resourceName,
    });
  }

  return [...resourceBreadcrumbs, ...breadcrumbs];
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

const memberBreadcrumbFor = ({
  active,
  data,
  resourceName,
  resourceUrl,
  singularName,
}: {
  active: boolean,
  data: Record<string, unknown>,
  resourceName: string,
  resourceUrl: string,
  singularName?: string,
}): Breadcrumb => {
  const resourceKey = singularName || singularize(resourceName);

  if (resourceKey in data && isPlainObject(data[resourceKey])) {
    const resource = data[resourceKey] as Record<string, unknown>;

    if ('name' in resource) {
      const { name } = resource;
      const key = resourceKeyFor(resource);

      if (active) { return { active, label: name.toString() }; }

      if (key === null || key.length === 0) {
        return { label: name.toString() };
      }

      return {
        label: name.toString(),
        url: `${resourceUrl}/${key}`,
      };
    }
  }

  if (active) { return { active, label: titleCase(resourceKey) }; }

  return { label: titleCase(resourceKey) };
};

const resourceKeyFor = (resource: Record<string, unknown>): string => {
  if ('slug' in resource) { return resource.slug.toString(); }

  if ('id' in resource) { return resource.id.toString(); }

  return null;
};

export const ResourcePageBreadcrumbs = ({
  action,
  breadcrumbs,
  data = {},
  page,
  resourceName,
  scope,
  singularName,
  status = 'uninitialized',
  wildcards,
}: {
  action: string,
  breadcrumbs?: Breadcrumb[],
  data?: Record<string, unknown>,
  page: {
    breadcrumbs?: Breadcrumb[],
    member?: boolean,
  },
  resourceName: string,
  scope?: string,
  singularName?: string,
  status?: string,
  wildcards?: Record<string, string>,
}): JSX.Element => {
  const resourceBreadcrumbs: Breadcrumb[] =
    generateResourceBreadcrumbs({ breadcrumbs, scope });
  const pageBreadcrumbs: Breadcrumb[] =
    generatePageBreadcrumbs({
      action,
      data,
      page,
      resourceBreadcrumbs,
      resourceName,
      singularName,
      status,
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
