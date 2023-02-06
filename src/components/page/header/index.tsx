import * as React from 'react';

import { PageNavigation } from '../navigation';
import type { NavigationProps } from '../navigation';
import { PageUser } from '../user';

interface IPageHeaderProps {
  title?: string;
  subtitle?: string;
  navigation?: NavigationProps | JSX.Element;
}

interface IRenderNavigation {
  navigation?: NavigationProps | JSX.Element;
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

const renderNavigation = ({ navigation }: IRenderNavigation): JSX.Element => {
  if (navigation === null || navigation === undefined) { return null; }

  if (!('length' in navigation)) { return navigation; }

  if (navigation.length === 0) { return null; }

  return (
    <>
      <hr className="hr-fancy my-1 block sm:hidden" />

      <PageNavigation navigation={navigation} />
    </>
  );
};

export const PageHeader = ({
  title = 'Librum',
  subtitle = 'Campaign Companion',
  navigation
}: IPageHeaderProps): JSX.Element => {
  return (
    <header className={defaultClassName}>
      <span className="page-title">{ title }</span>

      <PageHeaderSubtitle subtitle={subtitle} />

      { renderNavigation({ navigation }) }

      <hr className="hr-fancy my-1" />

      <PageUser />
    </header>
  );
};
