import * as React from 'react';

import { PageFooter } from './footer';
import { PageHeader } from './header';
import { useThemeStyles } from '@themes';
import { joinClassNames } from '@utils/react-utils';

interface PageProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

const defaultClassName =
  "flex flex-col max-w-screen-lg min-h-screen mx-auto p-3";

export const Page = ({
  title,
  subtitle,
  children
}: PageProps): JSX.Element => {
  const joinedClassNames = joinClassNames(
    defaultClassName,
    useThemeStyles('background'),
    useThemeStyles('text'),
  );

  return (
    <div className={joinedClassNames}>
      <PageHeader title={title} subtitle={subtitle} />

      <main className="grow">
        { children }
      </main>

      <PageFooter />
    </div>
  );
};
