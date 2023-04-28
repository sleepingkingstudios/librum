import * as React from 'react';

import type { AlertDirective } from '@api';
import {
  generateAlerts,
  useResourceQuery,
} from '@resources/api';
import { ResourceMissingComponent } from '@resources/components/missing-component';
import type { ResourcePageProps } from '@resources/components/page';
import { ResourcesTable } from '@resources/components/table';

const MissingTable = (): JSX.Element => (
  <ResourceMissingComponent name="Table" />
);

export const ResourceIndexPageContents = ({
  Table = MissingTable,
  baseUrl,
  resourceName,
  scope,
}: ResourcePageProps): JSX.Element => {
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
    scope,
    url: '',
  });

  return (
    <ResourcesTable
      Table={Table}
      resourceName={resourceName}
      response={response}
    />
  );
};
