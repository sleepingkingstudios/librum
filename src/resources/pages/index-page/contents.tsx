import * as React from 'react';

import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';

import type { AlertDirective } from '@api';
import {
  generateAlerts,
  useResourceQuery,
} from '@resources/api';
import type { ResourcePageProps } from '@resources/components/page';
import { ResourcesTable } from '@resources/components/table';

const MissingTable = (): JSX.Element => (
  <div className="min-h-[10rem] relative resources-table">
    <h3 className="my-5 text-danger">
      <Icon icon={faSkullCrossbones} />

      <span className="px-2">
        { "Missing <Table /> Component" }
      </span>

      <Icon icon={faSkullCrossbones} />
    </h3>
  </div>
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Table={Table}
      resourceName={resourceName}
      response={response}
    />
  );
};
