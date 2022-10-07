import * as React from 'react';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import {
  Dropdown,
  DropdownElementProps,
} from './dropdown';
import { render } from '@test-helpers/rendering';

describe('<Dropdown>', () => {
  const defaultProps: DropdownElementProps = {
    label: 'Rockets',
    items: [
      {
        label: 'Engines',
        url: '/rockets/engines',
      },
      {
        label: 'Fuel Tanks',
        url: '/rockets/fuel-tanks',
      },
    ],
    open: null,
    setOpen: jest.fn(),
  };

  describe('when all dropdowns are closed', () => {
    const closedProps: DropdownElementProps = {
      ...defaultProps,
      open: null,
    };

    it('should render the toggle', () => {
      const { getByRole } = render(<Dropdown {...closedProps} />);

      const button = getByRole('button', { name: defaultProps.label });

      expect(button).toBeVisible();
    });

    it('should call setOpen', async () => {
      const updateState = jest.fn();
      const { getByRole } =
        render(<Dropdown {...closedProps} setOpen={updateState} />);

      const button = getByRole('button', { name: defaultProps.label });

      await userEvent.click(button);

      expect(updateState).toHaveBeenCalledWith(defaultProps.label);
    });

    it('should not render dropdown items', () => {
      const { queryByText } = render(<Dropdown {...closedProps} />);

      defaultProps.items.forEach(
        ({ label }) => expect(queryByText(label)).toBeNull()
      )
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<Dropdown {...closedProps} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when another dropdown is open', () => {
    const closedProps: DropdownElementProps = {
      ...defaultProps,
      open: '/launch-sites',
    };

    it('should render the toggle', () => {
      const { getByRole } = render(<Dropdown {...closedProps} />);

      const button = getByRole('button', { name: defaultProps.label });

      expect(button).toBeVisible();
    });

    it('should call setOpen', async () => {
      const updateState = jest.fn();
      const { getByRole } =
        render(<Dropdown {...closedProps} setOpen={updateState} />);

      const button = getByRole('button', { name: defaultProps.label });

      await userEvent.click(button);

      expect(updateState).toHaveBeenCalledWith(defaultProps.label);
    });

    it('should not render dropdown items', () => {
      const { queryByText } = render(<Dropdown {...closedProps} />);

      defaultProps.items.forEach(
        ({ label }) => expect(queryByText(label)).toBeNull()
      )
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<Dropdown {...closedProps} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the dropdown is open', () => {
    const openProps: DropdownElementProps = {
      ...defaultProps,
      open: defaultProps.label,
    };

    it('should render the toggle', () => {
      const { getByRole } =
        render(<Dropdown {...openProps} />, { router: true });

      const button = getByRole('button', { name: defaultProps.label });

      expect(button).toBeVisible();
    });

    it('should call setOpen', async () => {
      const updateState = jest.fn();
      const { getByRole } = render(
        <Dropdown {...openProps} setOpen={updateState} />,
        { router: true }
      );

      const button = getByRole('button', { name: defaultProps.label });

      await userEvent.click(button);

      expect(updateState).toHaveBeenCalledWith(null);
    });

    it('should render the dropdown items', () => {
      const { queryByRole } =
        render(<Dropdown {...openProps} />, { router: true });

      defaultProps.items.forEach(
        ({ label }) => {
          expect(queryByRole('link', { name: label })).toBeVisible();
        }
      )
    });

    it('should match the snapshot', () => {
      const { asFragment } =
        render(<Dropdown {...openProps} />, { router: true });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
