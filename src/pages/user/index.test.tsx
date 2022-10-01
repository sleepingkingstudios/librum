import * as React from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { UserPage } from './index';
import { useAlerts } from '@alerts';
import { Page } from '@components/page';
import type { User } from '@session';
import { render } from '@test-helpers/rendering';
import { useGetUserQuery } from '@user/api';

jest.mock('@alerts');
jest.mock('@components/page');
jest.mock('@user/api');

const dismissAlert = jest.fn();
const dismissAllAlerts = jest.fn();
const displayAlert = jest.fn();
const mockPage = Page as jest.MockedFunction<typeof Page>;
const mockUseAlerts = useAlerts as jest.MockedFunction<typeof useAlerts>;
const mockUseQuery =
  useGetUserQuery as jest.MockedFunction<typeof useGetUserQuery>;

mockPage.mockImplementation(
  ({ children }) => (<div id="page">{ children }</div>)
);

mockUseAlerts.mockImplementation(() => ({
  alerts: [],
  dismissAlert,
  dismissAllAlerts,
  displayAlert,
}));

mockUseQuery.mockImplementation(() => ({
  isLoading: false,
  refetch: () => null,
}));

beforeEach(() => {
  dismissAlert.mockClear();
  dismissAllAlerts.mockClear();
  displayAlert.mockClear();
});

describe('<UserPage>', () => {
  describe('when the user is loading', () => {
    beforeEach(() => {
      mockUseQuery.mockImplementationOnce(() => ({
        isLoading: true,
        refetch: () => null,
      }));
    });

    it('should display the loading overlay', () => {
      const { getByText } = render(
        <UserPage />,
        { store: true },
      );

      const overlay = getByText('Loading User...');

      expect(overlay).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserPage />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the user has failed to load', () => {
    beforeEach(() => {
      mockUseQuery.mockImplementationOnce(() => ({
        error: {
          message: 'Something went wrong',
        },
        isLoading: false,
        refetch: () => null,
      }));
    });

    it('should display an alert', () => {
      const expected = {
        context: 'pages:user:request',
        icon: faUser,
        message: 'Unable to load current user.',
        type: 'failure',
      };

      render(
        <UserPage />,
        { store: true },
      );

      expect(displayAlert).toHaveBeenCalledWith(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserPage />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the user has successfully loaded', () => {
    const user: User = {
      id: '0',
      email: 'alan.bradley@example.com',
      role: 'user',
      slug: 'alan-bradley',
      username: 'Alan Bradley',
    };

    beforeEach(() => {
      mockUseQuery.mockImplementationOnce(() => ({
        data: {
          ok: true,
          data: { user },
        },
        isLoading: false,
        refetch: () => null,
      }));
    });

    it('should render the user information', () => {
      const expectedLabels = [
        'Name',
        'Email',
        'Role',
      ];
      const expectedDefinitions = [
        user.username,
        user.email,
        'User',
      ];

      const { queryAllByRole } = render(
        <UserPage />,
        { store: true },
      );

      const labels = queryAllByRole('term');

      expect(labels.map(
        (label) => label.textContent)
      ).toEqual(expectedLabels);

      const definitions = queryAllByRole('definition');

      expect(definitions.map(
        (definition) => definition.textContent)
      ).toEqual(expectedDefinitions);
    });

    it('should not display an alert', () => {
      render(
        <UserPage />,
        { store: true },
      );

      expect(displayAlert).not.toHaveBeenCalled();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserPage />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user clicks the Change Password link', () => {
      it('should display the change password form', () => {
        const { getByRole, getByText } = render(
          <UserPage />,
          { store: true },
        );
        const link = getByText('Change Password');

        userEvent.click(link);

        const button = getByRole('button', { name: 'Update Password' });

        expect(button).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment, getByText } = render(
          <UserPage />,
          { store: true },
        );
        const link = getByText('Change Password');

        userEvent.click(link);

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
