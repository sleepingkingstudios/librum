import * as React from 'react';

import type { Breadcrumbs } from './breadcrumbs';
import { PageFooter } from './footer';
import { PageHeader } from './header';
import type { NavigationProps } from './navigation';
import { useTheme } from '@themes';
import { joinClassNames } from '@utils/react-utils';

export type { Breadcrumbs } from './breadcrumbs';

interface PageProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumbs;
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
  breadcrumbs,
  children,
  navigation,
}: PageProps): JSX.Element => {
  const themeName = useTheme().name;
  const joinedClassNames = joinClassNames(
    defaultClassName,
    `theme-${themeName}`,
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

      <PageFooter breadcrumbs={breadcrumbs} />
    </div>
  );
};
