import * as React from 'react';

import type { AlertDirective } from '@api';
import {
  generateAlerts,
  useResourceQuery,
} from '@resources/api';

import { ResourcePage } from '@resources/components/page';
import {
  ResourceMissingComponent,
} from '@resources/components/missing-component';
import type { ResourcePageProps } from '@resources/components/page';
import { ResourcesTable } from '@resources/components/table';

const MissingTable = (): JSX.Element => (
  <ResourceMissingComponent name="Table" />
);

export const ResourceIndexPage = ({
  Table = MissingTable,
  page,
  ...config
}: ResourcePageProps): JSX.Element => {
  const {
    baseUrl,
    resourceName,
    route,
    scope,
  } = config;
  const alerts: AlertDirective[] = generateAlerts({
    action: 'find',
    member: false,
    query: true,
    resourceName,
    scope,
  });
  const [response] = useResourceQuery({
    action: 'index',
    alerts,
    baseUrl,
    member: false,
    resourceName,
    route,
    scope,
    url: '',
  });
  const contents = <ResourcesTable
    Table={Table}
    resourceName={resourceName}
    response={response}
  />;
  const pageWithDefaults = {
    contents,
    ...page,
  };

  return (
    <ResourcePage
      {...config}
      page={pageWithDefaults}
      response={response}
      action={''}
    />
  );
};
