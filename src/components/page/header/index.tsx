import * as React from 'react';

import { PageNavigation } from '../navigation';
import type { NavigationProps } from '../navigation';
import { PageUser } from '../user';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  navigation?: NavigationProps;
}

const defaultClassName = "mb-3 text-center sm:text-left";

const PageHeaderSubtitle = ({ subtitle }: { subtitle?: string; }): JSX.Element | null => {
  if (!(typeof subtitle === 'string')) { return null; }

  return (
    <React.Fragment>
      <br className="block sm:hidden" />

      <small className="page-subtitle m-0 sm:ml-2">{ subtitle }</small>
    </React.Fragment>
  )
}

export const PageHeader = ({
  title = 'Librum',
  subtitle = 'Campaign Companion',
  navigation
}: PageHeaderProps): JSX.Element => {
  return (
    <header className={defaultClassName}>
      <span className="page-title">{ title }</span>

      <PageHeaderSubtitle subtitle={subtitle} />

      <hr className="hr-fancy my-1 block sm:hidden" />

      <PageNavigation navigation={navigation} />

      <hr className="hr-fancy mt-1" />

      <PageUser />
    </header>
  )
}
