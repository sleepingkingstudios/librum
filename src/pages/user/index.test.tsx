import * as React from 'react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { UserPage } from './index';
import {
  responseWithData,
  responseWithStatus,
} from '@api';
import type { Response } from '@api';
import type { User } from '@session';
import { render } from '@test-helpers/rendering';
import { useGetUserQuery } from './request';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@core/navigation', () => require('@core/navigation/mocks'));
jest.mock('./request');

const mockUseQuery =
  useGetUserQuery as jest.MockedFunction<typeof useGetUserQuery>;

describe('<UserPage>', () => {
  const refetch = jest.fn();

  describe('when the user is loading', () => {
    const response: Response = responseWithStatus({ status: 'loading' });

    beforeEach(() => {
      mockUseQuery.mockImplementation(() => [response, refetch]);
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
    const response: Response = responseWithStatus({ status: 'failure' });

    beforeEach(() => {
      mockUseQuery.mockImplementation(() => [response, refetch]);
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
    const response: Response = responseWithData({
      data: { user },
    });

    beforeEach(() => {
      mockUseQuery.mockImplementation(() => [response, refetch]);
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

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <UserPage />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user clicks the Change Password link', () => {
      it('should display the change password form', async () => {
        const { getByRole, getByText } = render(
          <UserPage />,
          { store: true },
        );
        const link = getByText('Change Password');

        await userEvent.click(link);

        const button = getByRole('button', { name: 'Update Password' });

        expect(button).toBeVisible();
      });

      it('should match the snapshot', async () => {
        const { asFragment, getByText } = render(
          <UserPage />,
          { store: true },
        );
        const link = getByText('Change Password');

        await userEvent.click(link);

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
