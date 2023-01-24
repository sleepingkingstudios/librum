import * as React from 'react';

import type { DropdownProps } from './dropdown';
import type { NavigationItemProps } from './item';

const renderNavigationItem = (
  item: DropdownProps | NavigationItemProps
): JSX.Element => {
  const { label } = item;

  if ('items' in item) {
    return (
      <li key={label}>
        { label }
        <ul>
          { item.items.map(renderNavigationItem) }
        </ul>
      </li>
    );
  }

  const { url } = item;

  return (
    <li aria-label="navigation-item" key={label}>{ `${label} @ ${url}` }</li>
  );
};

export const PageNavigation = ({
  navigation,
}: {
  navigation: Array<DropdownProps | NavigationItemProps>,
}): JSX.Element => {
  if (!navigation) { return null; }

  if (navigation.length === 0) { return null; }

  return (
    <ul aria-label="navigation">
      {
        navigation.map(renderNavigationItem)
      }
    </ul>
  );
};
