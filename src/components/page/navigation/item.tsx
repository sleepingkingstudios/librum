import * as React from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import { useThemeStyles } from '@themes';

export interface NavigationItemProps {
  label: string;
  url: string;
}

export const NavigationItem = ({ label, url }: NavigationItemProps): JSX.Element => {
  const className = useThemeStyles('navigation-item');
  const linkClassName = useThemeStyles('navigation-link');
  const disabledClassName = useThemeStyles('navigation-link-disabled');
  const { pathname } = useLocation();

  if (pathname === url) {
    return (
      <li className={className}>
        <p className={disabledClassName}>{ label }</p>
      </li>
    );
  } else {
    return (
      <li className={className}>
        <Link className={linkClassName} to={url}>{ label }</Link>
      </li>
    );
  }
};
