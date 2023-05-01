import * as React from 'react';

import { generateResource } from '@resources';
import { PublishersTable } from './components';
import { CoreNavigation } from '../navigation';

const navigation = (<CoreNavigation />);

export const { resource, routes } = generateResource({
  Table: PublishersTable,
  breadcrumbs: [{
    label: 'Home',
    url: '/',
  }],
  navigation,
  resourceName: 'publishers',
  route: '/publishers',
  scope: 'core',
});
