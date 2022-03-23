import * as React from 'react';
import { map } from 'lodash';

import { joinClassNames } from '@utils/react-utils';
import {
  Dropdown,
  DropdownProps,
} from './dropdown';
import {
  NavigationItem,
  NavigationItemProps,
} from './item';

export type NavigationProps = Array<NavigationItemProps | DropdownProps>;

interface PageNavigationProps {
  className?: string;
  navigation: NavigationProps;
}

export const PageNavigation = (
  { className, navigation }: PageNavigationProps
): JSX.Element => {
  const joinedClassNames = joinClassNames(
    'page-navigation relative z-10',
    className,
  );
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <nav className={joinedClassNames}>
      <ul className="flex flex-col sm:flex-row">
        {
          map(
            navigation,
            (item: DropdownProps | NavigationItemProps): JSX.Element => {
              const { label } = item;

              if('items' in item) {
                return (
                  <Dropdown
                    key={label}
                    open={open}
                    setOpen={setOpen}
                    {...item}
                  />
                );
              }

              return (<NavigationItem key={label} {...item} />);
            },
          )
        }
      </ul>
    </nav>
  );
};
