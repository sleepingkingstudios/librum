import * as React from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import type { NavigationItemProps } from './item';

export const DropdownItem = ({ label, url }: NavigationItemProps): JSX.Element => {
  const { pathname } = useLocation();

  if (pathname === url) {
    return (
      <li className="dropdown-item">
        <p className="dropdown-item-link-disabled text-muted">{ label }</p>
      </li>
    );
  } else {
    return (
      <li className="dropdown-item">
        <Link className="dropdown-item-link" to={url}>
          { label }
        </Link>
      </li>
    );
  }
};
