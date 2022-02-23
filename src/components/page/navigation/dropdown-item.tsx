import * as React from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import { NavigationItemProps } from './item';
import { useThemeStyles } from '@themes';

export const DropdownItem = ({ label, url }: NavigationItemProps): JSX.Element => {
  const className = useThemeStyles('navigation-dropdown-item');
  const linkClassName = useThemeStyles('navigation-dropdown-link');
  const disabledClassName = useThemeStyles('navigation-dropdown-link-disabled');
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
        <Link className={linkClassName} to={url}>
          { label }
        </Link>
      </li>
    );
  }
};
