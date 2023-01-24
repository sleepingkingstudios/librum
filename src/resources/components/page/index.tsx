import * as React from 'react';

import type {
  ResourcePageOptions,
  ResourcePageProps,
} from './types';
import type { ButtonProps as Button } from '@components/button';
import { Heading } from '@components/heading';
import { Page } from '@components/page';
import type { Breadcrumb } from '@components/page';
import {
  buildComponent,
  isElement,
} from '@utils/react-utils';
import { titleCase } from '@utils/text';
import { ResourceBreadcrumbs } from '../breadcrumbs';

export type { ResourcePageProps } from './types';

const renderBreadcrumbs = ({
  action,
  breadcrumbs,
  member,
  page,
  resourceName,
  scope,
}: {
  action: string,
  breadcrumbs?: Breadcrumb[],
  member: boolean,
  page: ResourcePageOptions,
  resourceName: string,
  scope?: string,
}): JSX.Element => {
  if (typeof page.breadcrumbs === 'string' || isElement(page.breadcrumbs)) {
    return page.breadcrumbs;
  }

  const pageBreadcrumbs = page.breadcrumbs as Breadcrumb[];

  return (
    <ResourceBreadcrumbs
      action={action}
      breadcrumbs={breadcrumbs}
      member={member}
      page={{ breadcrumbs: pageBreadcrumbs }}
      resourceName={resourceName}
      scope={scope}
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
  resourceName,
}: {
  action: string,
  buttons?: Button[],
  heading?: string | JSX.Element,
  resourceName: string,
}): JSX.Element => {
  if (heading && typeof heading !== 'string') { return heading; }

  const label: string = (typeof heading === 'string' && heading.length > 0) ?
    heading :
    `${titleCase(action)} ${titleCase(resourceName)}`;

  return (
    <Heading buttons={buttons} size={1}>
      { label }
    </Heading>
  );
};

export const ResourcePage = ({
  page,
  ...config
}: ResourcePageProps): JSX.Element => {
  const {
    buttons,
    heading,
    navigation,
    subtitle,
    title,
  } = page;
  const {
    action,
    breadcrumbs,
    member,
    resourceName,
    scope,
  } = config;
  const renderedBreadcrumbs = renderBreadcrumbs({
    action,
    breadcrumbs,
    member,
    page,
    resourceName,
    scope,
  });

  return (
    <Page
      breadcrumbs={renderedBreadcrumbs}
      navigation={navigation}
      subtitle={subtitle}
      title={title}
    >
      { renderHeading({ action, buttons, heading, resourceName }) }

      { renderContent({ page, ...config }) }
    </Page>
  );
};
