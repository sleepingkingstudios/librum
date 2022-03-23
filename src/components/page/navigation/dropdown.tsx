import * as React from 'react';
import { map } from 'lodash';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
} from '@fortawesome/free-solid-svg-icons';

import { DropdownItem } from './dropdown-item';
import { NavigationItemProps } from './item';

export interface DropdownProps {
  label: string;
  items: Array<NavigationItemProps>;
}

export interface DropdownElementProps extends DropdownProps {
  open: string;
  setOpen: React.Dispatch<React.SetStateAction<string | null>>;
}

interface renderDropdownItemsProps {
  items: Array<NavigationItemProps>;
  open: boolean;
}

const renderDropdownItem = (item: NavigationItemProps): JSX.Element => {
  const { label } = item;

  return (<DropdownItem key={label} {...item} />);
};

const renderDropdownItems = (
  { items, open }: renderDropdownItemsProps
): JSX.Element => {
  if (!open) { return null; }

  return (
    <ul>
      { map(items, renderDropdownItem) }
    </ul>
  )
}

export const Dropdown = (
  {
    label,
    items,
    open,
    setOpen,
  }: DropdownElementProps
): JSX.Element => {
  const isOpen = label === open;
  const openDropdown = () => setOpen(label);
  const closeDropdown = () => setOpen(null);

  return (
    <li className="dropdown-container">
      <div className="dropdown">
        <button
          onClick={isOpen ? closeDropdown : openDropdown}
          className="dropdown-label"
        >
          { label }
          <Icon
            icon={isOpen ? faCaretDown : faCaretUp}
            size='xs'
            className='ml-2'
          />
        </button>

        { renderDropdownItems({ items, open: isOpen }) }
      </div>
    </li>
  );
}
