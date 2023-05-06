import * as React from 'react';

import { generateResource } from '@resources';
import {
  PublisherBlock,
  PublishersTable,
} from './components';
import { CoreNavigation } from '../navigation';

const navigation = (<CoreNavigation />);

export const { resource, routes } = generateResource({
  Block: PublisherBlock,
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
