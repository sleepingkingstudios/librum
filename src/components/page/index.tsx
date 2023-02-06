import * as React from 'react';

import { PageAlerts } from './alerts';
import type { Breadcrumb } from './breadcrumbs';
import { PageFooter } from './footer';
import { PageHeader } from './header';
import type { NavigationProps } from './navigation';
import { useTheme } from '@themes';
import { joinClassNames } from '@utils/react-utils';

export type {
  Breadcrumb,
} from './breadcrumbs';
export type { NavigationProps } from './navigation';

interface PageProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[] | JSX.Element;
  children: React.ReactNode,
  navigation?: NavigationProps | JSX.Element;
}

const defaultClassName =
  "flex flex-col max-w-screen-lg min-h-screen mx-auto p-3";

export const Page = ({
  title,
  subtitle,
  breadcrumbs,
  children,
  navigation,
}: PageProps): JSX.Element => {
  const joinedClassNames = joinClassNames(
    defaultClassName,
    useTheme().className,
  );

  return (
    <div className={joinedClassNames}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        navigation={navigation}
      />

      <main className="grow">
        <PageAlerts />

        { children }
      </main>

      <PageFooter breadcrumbs={breadcrumbs} />
    </div>
  );
};
