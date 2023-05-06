import * as React from 'react';
import { useParams } from 'react-router-dom';

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
import { ResourceBlock } from '@resources/components/block';

const MissingBlock = (): JSX.Element => (
  <ResourceMissingComponent name="Block" />
);

export const ResourceShowPage = ({
  Block = MissingBlock,
  page,
  ...config
}: ResourcePageProps): JSX.Element => {
  const params = useParams();
  const {
    baseUrl,
    resourceName,
    route,
    scope,
    singularName,
  } = config;
  const { member } = page;
  const alerts: AlertDirective[] = generateAlerts({
    action: 'show',
    member,
    query: true,
    resourceName,
    scope,
    singularName,
  });
  const [response] = useResourceQuery({
    action: 'show',
    alerts,
    baseUrl,
    member,
    resourceName,
    route,
    scope,
    singularName,
    url: '',
    wildcards: params,
  });
  const contents = <ResourceBlock
    Block={Block}
    resourceName={resourceName}
    response={response}
    singularName={singularName}
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
