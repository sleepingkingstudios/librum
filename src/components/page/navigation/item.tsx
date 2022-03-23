import * as React from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

export interface NavigationItemProps {
  label: string;
  url: string;
}

export const NavigationItem = ({ label, url }: NavigationItemProps): JSX.Element => {
  const { pathname } = useLocation();

  if (pathname === url) {
    return (
      <li className="navigation-item">
        <p className="navigation-item-link-disabled text-muted">{ label }</p>
      </li>
    );
  } else {
    return (
      <li className="navigation-item">
        <Link className="navigation-item-link" to={url}>{ label }</Link>
      </li>
    );
  }
};
