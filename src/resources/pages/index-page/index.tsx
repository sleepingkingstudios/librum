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
  page,
  ...config
}: ResourcePageProps): JSX.Element => {
  const { resourceName } = config;
  const pageWithDefaults = {
    ...generatePageDefaults({ resourceName }),
    ...page,
  };

  return (
    <ResourcePage
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Table={Table}
      action={action}
      page={pageWithDefaults}
      {...config}
    />
  );
};
