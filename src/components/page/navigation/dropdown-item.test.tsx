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
    it('should render the link', () => {
      const { getByRole } =
        render(<DropdownItem {...defaultProps} />, { router: true });

      const link = getByRole('link', { name: defaultProps.label });

      expect(link).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } =
        render(<DropdownItem {...defaultProps} />, { router: true });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user clicks the link', () => {
      it('should not render a link', async () => {
        const { getByRole, getByText } =
          render(<DropdownItem {...defaultProps} />, { router: true });

        const link = getByRole('link', { name: defaultProps.label });

        await userEvent.click(link);

        expect(link).not.toBeVisible();

        expect(getByText(defaultProps.label)).toBeVisible();
      });
    });
  });

  describe('when the pathname matches the url', () => {
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
          },
        );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
