import * as React from 'react';

import { Page } from '@components/page';
import { titleCase } from '@utils/text';
import { useResourceQuery } from '../api';
import { ResourcesTable } from '../components/table';

import { ResourceIndexPageProps } from './types';

export const ResourceIndexPage = ({
  Table,
  alerts,
  breadcrumbs,
  effects,
  navigation,
  resourceName,
  scope,
  singularName,
  subtitle,
  title,
  useQuery,
}: ResourceIndexPageProps): JSX.Element => {
  const useRequest = useResourceQuery({
    action: 'index',
    alerts,
    effects,
    member: false,
    resourceName,
    singularName,
    scope,
    useQuery,
  });

  return (
    <Page
      breadcrumbs={breadcrumbs}
      navigation={navigation}
      subtitle={subtitle}
      title={title}
    >
      <h1>{ titleCase(resourceName) }</h1>

      <ResourcesTable
        Table={Table}
        resourceName={resourceName}
        useRequest={useRequest}
      />
    </Page>
  );
};
