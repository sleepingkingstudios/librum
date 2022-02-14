import * as React from 'react';

import { FancyHr } from '@components/fancy-hr';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

const renderSubtitle = ({ subtitle }: { subtitle?: string; }): JSX.Element | null => {
  if (!(typeof subtitle === 'string')) { return null; }

  return (
    <React.Fragment>
      <br className="block sm:hidden" />

      <small className="m-0 sm:ml-2 text-2xl">{ subtitle }</small>
    </React.Fragment>
  )
}

export const PageHeader = ({
  title = 'Librum',
  subtitle = 'Campaign Companion'
}: PageHeaderProps): JSX.Element => {
  return (
    <header className="font-serif leading-9 mb-3 text-5xl text-center sm:text-left text-text-strong dark:text-text-strong-dark">
      { title }

      { renderSubtitle({ subtitle }) }

      <FancyHr className="mt-1" />
    </header>
  )
}
