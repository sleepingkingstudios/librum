import * as React from 'react';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { DropdownItem } from './dropdown-item';
import { render } from '@test-helpers/rendering';

describe('<DropdownItem>', () => {
  const defaultProps = {
    label: 'Go Back',
    url: '/back',
  };

  describe('when the pathname does not match the url', () => {
    const theme = {
      navigationDropdownItem: 'font-mono',
      navigationDropdownLink: 'text-[#ff3366]',
    };

    it('should render the link', () => {
      const { getByRole } =
        render(<DropdownItem {...defaultProps} />, { router: true });

      const link = getByRole('link', { name: defaultProps.label });

      expect(link).toBeVisible();

      userEvent.click(link);

      expect(link).not.toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } =
        render(<DropdownItem {...defaultProps} />, { router: true, theme });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the pathname matches the url', () => {
    const theme = {
      navigationDropdownItem: 'font-mono',
      navigationDropdownLinkDisabled: 'text-muted',
    };

    it('should not render a link', () => {
      const {
        getByText,
        queryByRole,
      } = render(
        <DropdownItem {...defaultProps} />,
        {
          initialEntries: [defaultProps.url],
          router: true,
        },
      );

      expect(queryByRole('link')).toBeNull();

      expect(getByText(defaultProps.label)).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } =
        render(
          <DropdownItem {...defaultProps} />,
          {
            initialEntries: [defaultProps.url],
            router: true,
            theme,
          },
        );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
