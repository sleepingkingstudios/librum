import * as React from 'react';

import { PageNavigation } from '@components/page/navigation';

const navigation = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Publishers',
    url: '/publishers',
  },
  {
    label: 'Game Systems',
    url: '/game_systems',
  },
  {
    label: 'Sources',
    items: [
      {
        label: 'Books',
        url: '/sources/books',
      },
      {
        label: 'Websites',
        url: '/sources/websites',
      },
    ],
  },
  {
    label: 'Admin',
    items: [
      {
        label: 'Users',
        url: '/admin/users',
      },
    ],
  },
];

export const CoreNavigation = () => (
  <PageNavigation navigation={navigation} />
);
