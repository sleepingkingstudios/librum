import * as React from 'react';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { NavigationItem } from './item';
import { render } from '@test-helpers/rendering';

describe('<NavigationItem>', () => {
  const defaultProps = {
    label: 'Go Back',
    url: '/back',
  };

  describe('when the pathname does not match the url', () => {
    it('should render the link', async () => {
      const { getByRole } =
        render(<NavigationItem {...defaultProps} />, { router: true });

      const link = getByRole('link', { name: defaultProps.label });

      expect(link).toBeVisible();

      await userEvent.click(link);

      expect(link).not.toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } =
        render(<NavigationItem {...defaultProps} />, { router: true });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the pathname matches the url', () => {
    it('should not render a link', () => {
      const {
        getByText,
        queryByRole,
      } = render(
        <NavigationItem {...defaultProps} />,
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
          <NavigationItem {...defaultProps} />,
          {
            initialEntries: [defaultProps.url],
            router: true,
          },
        );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
