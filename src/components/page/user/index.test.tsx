import * as React from 'react';
import { faUserXmark } from '@fortawesome/free-solid-svg-icons';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { PageUser } from './index';
import { useAlerts as mockUseAlerts } from '@alerts/mocks';
import {
  actions,
  selector,
} from '@session';
import type {
  Session,
  User,
} from '@session';
import { createStore } from '@test-helpers/store';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@alerts', () => require('@alerts/mocks'));

const { displayAlert } = mockUseAlerts();

describe('<PageUser>', () => {
  beforeEach(() => { displayAlert.mockClear(); });

  it('should not show a user name', () => {
    const { queryByText } = render(<PageUser />, { store: true });

    expect(queryByText(/currently logged in/)).toBeNull();
  });

  it('should not show the logout button', () => {
    const { queryByRole } = render(<PageUser />, { store: true });

    expect(queryByRole('button', { name: 'Log Out' })).toBeNull();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(<PageUser />, { store: true });

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the session is authenticated', () => {
    const user: User = {
      email: 'alan.bradley@example.com',
      id: '00000000-0000-0000-0000-000000000000',
      role: 'user',
      slug: 'alan-bradley',
      username: 'Alan Bradley',
    };
    const token = '12345';
    const { create } = actions;

    it('should show the user name link', () => {
      const { dispatch, store } = createStore();
      dispatch(create({ token, user }));

      const { getByRole, getByText } = render(
        <PageUser />,
        {
          router: true,
          store,
        },
      );

      const notice = getByText(/currently logged in/);

      expect(notice).toBeVisible();
      expect(notice).toHaveTextContent('You are currently logged in as');

      expect(getByRole('link', { name: user.username })).toBeVisible();
    });

    it('should show the logout link', () => {
      const { dispatch, store } = createStore();
      dispatch(create({ token, user }));

      const { getByRole } = render(
        <PageUser />,
        {
          router: true,
          store,
        },
      );

      expect(getByRole('button', { name: 'Log Out' })).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { dispatch, store } = createStore();
      dispatch(create({ token, user }));

      const { asFragment } = render(
        <PageUser />,
        {
          router: true,
          store,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user clicks the logout button', () => {
      afterEach(() => { localStorage.clear(); });

      it('should not show a user name', async () => {
        const { dispatch, store } = createStore();
        dispatch(create({ token, user }));

        const { getByRole, queryByText } = render(
          <PageUser />,
          {
            router: true,
            store,
          },
        );
        const button = getByRole('button', { name: 'Log Out' });

        await userEvent.click(button);

        expect(queryByText(/currently logged in/)).toBeNull();
      });

      it('should display an alert', async () => {
        const expected = {
          context: 'authentication:session',
          icon: faUserXmark,
          message: 'You have successfully logged out.',
          type: 'warning',
        };
        const { dispatch, store } = createStore();

        dispatch(create({ token, user }));

        const { getByRole } = render(
          <PageUser />,
          {
            router: true,
            store,
          },
        );
        const button = getByRole('button', { name: 'Log Out' });

        await userEvent.click(button);

        expect(displayAlert).toHaveBeenCalledWith(expected);
      });

      it('should update the store', async () => {
        const expected = { authenticated: false };

        const { dispatch, getState, store } = createStore();
        dispatch(create({ token, user }));

        const { getByRole } = render(
          <PageUser />,
          {
            router: true,
            store,
          },
        );
        const button = getByRole('button', { name: 'Log Out' });

        await userEvent.click(button);

        const state = getState() as { session: Session };

        expect(selector(state)).toEqual(expected);
      });

      it('should clear the stored session', async () => {
        localStorage.setItem('session', JSON.stringify({ authenticated: true }));

        const { dispatch, store } = createStore();
        dispatch(create({ token, user }));

        const { getByRole } = render(
          <PageUser />,
          {
            router: true,
            store,
          },
        );
        const button = getByRole('button', { name: 'Log Out' });

        await userEvent.click(button);

        expect(localStorage.getItem('session')).toBeNull();
      });
    });
  });
});
