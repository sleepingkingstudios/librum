import * as React from 'react';

import { PageFooter } from './footer';
import { PageHeader } from './header';
import { useThemeStyles } from '@themes';
import type { NavigationProps } from './navigation';
import { joinClassNames } from '@utils/react-utils';

interface PageProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode,
  navigation?: NavigationProps;
}

const defaultClassName =
  "flex flex-col max-w-screen-lg min-h-screen mx-auto p-3";

const defaultNavigation = [
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

export const Page = ({
  title,
  subtitle,
  children,
  navigation,
}: PageProps): JSX.Element => {
  const joinedClassNames = joinClassNames(
    defaultClassName,
    useThemeStyles('background'),
    useThemeStyles('text'),
  );

  return (
    <div className={joinedClassNames}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        navigation={navigation || defaultNavigation}
      />

      <main className="grow">
        { children }
      </main>

      <PageFooter />
    </div>
  );
};
