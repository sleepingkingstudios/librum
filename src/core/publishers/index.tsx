import * as React from 'react';

import { generateResource } from '@resources';
import { PublishersTable } from './components/table';
import { CoreNavigation } from '../navigation';

const navigation = (<CoreNavigation />);

export const { resource, routes } = generateResource({
  Table: PublishersTable,
  baseUrl: 'publishers',
  breadcrumbs: [{
    label: 'Home',
    url: '/',
  }],
  navigation,
  resourceName: 'publishers',
  route: '/publishers',
  scope: 'core',
});
