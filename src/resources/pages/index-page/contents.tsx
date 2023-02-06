import * as React from 'react';

import type { UseQuery } from '@api';
import { useResourceQuery } from '@resources/api/hooks';
import type { ResourcePageProps } from '@resources/components/page';
import { ResourcesTable } from '@resources/components/table';

export const ResourceIndexPageContents = ({
  Table,
  apiHooks,
  page,
  resourceName,
  scope,
  singularName,
}: ResourcePageProps): JSX.Element => {
  if (!('useIndexResources' in apiHooks)) {
    const hooks = Object.keys(apiHooks);
    let message = 'undefined API endpoint "useIndexResources"';

    if (hooks.length > 0) {
      message = `${message} - valid hooks are ${hooks.join(', ')}`;
    }

    throw new Error(`[ERROR] <ResourceIndexPageContents /> ${message}`);
  }

  if (!Table) {
    const message = 'default IndexPageContents requires Table property';

    throw new Error(`[ERROR] <ResourceIndexPageContents /> ${message}`);
  }

  const {
    alerts,
    effects,
  } = page;
  const useQuery = apiHooks.useIndexResources as UseQuery;
  const useRequest = useResourceQuery({
    ...(alerts ? { alerts } : {}),
    ...(effects ? { effects } : {}),
    ...(scope ? { scope } : {}),
    ...(singularName ? { singularName } : {}),
    action: 'index',
    member: false,
    resourceName,
    useQuery,
  });

  return (
    <ResourcesTable
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Table={Table}
      resourceName={resourceName}
      useRequest={useRequest}
    />
  );
};
