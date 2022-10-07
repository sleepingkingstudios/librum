import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { UserUpdatePassword } from './index';
import { render } from '@test-helpers/rendering';

describe('<UserUpdatePassword />', () => {
  it('should show the link', () => {
    const { getByText } = render(
      <UserUpdatePassword />,
      { store: true },
    );
    const link = getByText('Change Password');

    expect(link).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <UserUpdatePassword />,
      { store: true },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user clicks the Change Password link', () => {
    it('should display the change password form', async () => {
      const { getByRole, getByText } = render(
        <UserUpdatePassword />,
        { store: true },
      );
      const link = getByText('Change Password');

      await userEvent.click(link);

      const button = getByRole('button', { name: 'Update Password' });

      expect(button).toBeVisible();
    });

    it('should match the snapshot', async () => {
      const { asFragment, getByText } = render(
        <UserUpdatePassword />,
        { store: true },
      );
      const link = getByText('Change Password');

      await userEvent.click(link);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
