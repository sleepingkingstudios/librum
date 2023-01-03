import * as React from 'react';

import { PageNavigation } from '@components/page/navigation/mocks';

const navigation = [
  {
    label: 'Nav Item',
    url: '/nav-item',
  },
  {
    label: 'Dropdown',
    items: [
      {
        label: 'Dropdown Item',
        url: '/dropdown-item',
      },
    ],
  },
];

export const CoreNavigation =
  (): JSX.Element => (<PageNavigation navigation={navigation} />);
