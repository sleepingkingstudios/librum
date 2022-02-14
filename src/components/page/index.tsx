import * as React from 'react';

import { PageFooter } from './footer';
import { PageHeader } from './header';

interface PageProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Page = ({
  title,
  subtitle,
  children
}: PageProps): JSX.Element => {
  return (
    <div className="bg-background dark:bg-background-dark flex flex-col max-w-screen-lg min-h-screen mx-auto p-3 text-text-primary">
      <PageHeader title={title} subtitle={subtitle} />

      <main className="grow">
        { children }
      </main>

      <PageFooter />
    </div>
  )
}
