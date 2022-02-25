import * as React from 'react';

import { FancyHr } from '@components/fancy-hr';
import { useThemeStyles } from '@themes';
import { joinClassNames } from '@utils/react-utils';

import {
  NavigationProps,
  PageNavigation,
} from './navigation';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  navigation?: NavigationProps;
}

const defaultClassName = "leading-9 mb-3 text-center sm:text-left";

const PageHeaderSubtitle = ({ subtitle }: { subtitle?: string; }): JSX.Element | null => {
  const joinedClassNames = joinClassNames(
    'm-0 sm:ml-2',
    useThemeStyles('subtitle'),
  );

  if (!(typeof subtitle === 'string')) { return null; }

  return (
    <React.Fragment>
      <br className="block sm:hidden" />

      <small className={joinedClassNames}>{ subtitle }</small>
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
      <span className={useThemeStyles('title')}>{ title }</span>

      <PageHeaderSubtitle subtitle={subtitle} />

      <FancyHr className="my-1 block sm:hidden" />

      <PageNavigation navigation={navigation} />

      <FancyHr className="mt-1" />
    </header>
  )
}