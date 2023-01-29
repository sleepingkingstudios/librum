import * as React from 'react';

import { ResourcePage } from '@resources/components/page';
import type { ResourcePageProps } from '@resources/components/page';
import { titleCase } from '@utils/text';
import { ResourceIndexPageContents } from './contents';

const generatePageDefaults = ({
  resourceName,
}: {
  resourceName: string,
}) => ({
  breadcrumbs: [
    {
      active: true,
      label: titleCase(resourceName),
    },
  ],
  contents: ResourceIndexPageContents,
  heading: titleCase(resourceName),
});

export const ResourceIndexPage = ({
  Table,
  action,
  apiHooks,
  page,
  resourceName,
}: ResourcePageProps): JSX.Element => {
  const pageWithDefaults = {
    ...generatePageDefaults({ resourceName }),
    ...page,
  };

  return (
    <ResourcePage
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Table={Table}
      action={action}
      apiHooks={apiHooks}
      page={pageWithDefaults}
      resourceName={resourceName}
    />
  );
};
