import * as React from 'react';

import { resource } from './index';
import {
  PublishersTable,
  PublisherBlock,
} from './components';
import { CoreNavigation } from '../navigation';

describe('Publishers', () => {
  describe('resource', () => {
    const expected = {
      Block: PublisherBlock,
      Table: PublishersTable,
      breadcrumbs: [{
        label: 'Home',
        url: '/',
      }],
      navigation: (<CoreNavigation />),
      resourceName: 'publishers',
      route: '/publishers',
      scope: 'core',
    };

    it('should return the resource configuration', () => {
      expect(resource).toEqual(expected);
    });
  });
});
