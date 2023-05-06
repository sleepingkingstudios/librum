import * as React from 'react';

import type {
  ResourcePageOptions,
  ResourcePageProps,
} from './types';
import { responseWithStatus } from '@api';
import type { Response } from '@api';
import type { ButtonProps as Button } from '@components/button';
import { Page } from '@components/page';
import type { Breadcrumb } from '@components/page';
import {
  buildComponent,
  isElement,
} from '@utils/react-utils';
import { ResourcePageBreadcrumbs } from './breadcrumbs';
import { ResourcePageHeading } from './heading';

export type {
  ResourcePageOptions,
  ResourcePageProps,
} from './types';

const renderBreadcrumbs = ({
  action,
  breadcrumbs,
  page,
  resourceName,
  response,
  scope,
  singularName,
}: {
  action: string,
  breadcrumbs?: Breadcrumb[],
  page: ResourcePageOptions,
  resourceName: string,
  response: Response,
  scope?: string,
  singularName?: string,
}): JSX.Element => {
  if (typeof page.breadcrumbs === 'string' || isElement(page.breadcrumbs)) {
    return page.breadcrumbs;
  }

  const data = (response.data || {}) as Record<string, unknown>;
  const { status } = response;
  const pageBreadcrumbs = page.breadcrumbs as Breadcrumb[];

  return (
    <ResourcePageBreadcrumbs
      action={action}
      breadcrumbs={breadcrumbs}
      data={data}
      page={{ breadcrumbs: pageBreadcrumbs, member: page.member }}
      resourceName={resourceName}
      scope={scope}
      singularName={singularName}
      status={status}
    />
  );
};

const renderContent = ({
  page,
  ...config
}: ResourcePageProps): JSX.Element => {
  if (!('contents' in page)) { return null; }

  const {
    afterContents,
    beforeContents,
    contents,
  } = page;
  const props: Record<string, unknown> = { page, ...config };

  return (
    <>
      { buildComponent(beforeContents, props) }

      { buildComponent(contents, props) }

      { buildComponent(afterContents, props) }
    </>
  );
};

const renderHeading = ({
  action,
  buttons,
  heading,
  member,
  resourceName,
  response,
  singularName,
}: {
  action: string,
  buttons?: Button[],
  heading?: string | JSX.Element,
  member: boolean,
  resourceName: string,
  response: Response,
  singularName?: string,
}): JSX.Element => {
  if (heading && typeof heading !== 'string') { return heading; }

  const data = (response.data || {}) as Record<string, unknown>;
  const { status } = response;
  const label = heading as string;

  return (
    <ResourcePageHeading
      action={action}
      buttons={buttons}
      data={data}
      label={label}
      member={member}
      resourceName={resourceName}
      singularName={singularName}
      status={status}
    />
  );
};

export const ResourcePage = ({
  page,
  response = responseWithStatus({ status: 'uninitialized' }),
  ...config
}: ResourcePageProps): JSX.Element => {
  const {
    buttons,
    heading,
    member,
    navigation,
    subtitle,
    title,
  } = page;
  const {
    action,
    breadcrumbs,
    resourceName,
    singularName,
    scope,
  } = config;
  const renderedBreadcrumbs = renderBreadcrumbs({
    action,
    breadcrumbs,
    page,
    resourceName,
    response,
    singularName,
    scope,
  });

  return (
    <Page
      breadcrumbs={renderedBreadcrumbs}
      navigation={navigation}
      subtitle={subtitle}
      title={title}
    >
      {
        renderHeading({
          action,
          buttons,
          heading,
          member,
          resourceName,
          response,
          singularName,
        })
      }

      { renderContent({ page, response, ...config }) }
    </Page>
  );
};
