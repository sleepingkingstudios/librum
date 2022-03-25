import * as React from 'react';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { PageUser } from './index';
import {
  actions,
  selector,
} from '@session';
import type {
  Session,
  User,
} from '@session';
import { render } from '@test-helpers/rendering';
import { createStore } from '@test-helpers/store';

describe('<PageUser>', () => {
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

    it('should show the user name', () => {
      const { dispatch, store } = createStore();
      dispatch(create({ token, user }));

      const { getByText } = render(<PageUser />, { store });

      const notice = getByText(/currently logged in/);

      expect(notice).toBeVisible();
      expect(notice).toHaveTextContent('You are currently logged in as');

      expect(getByText(user.username)).toBeVisible();
    });

    it('should show the logout link', () => {
      const { dispatch, store } = createStore();
      dispatch(create({ token, user }));

      const { getByRole } = render(<PageUser />, { store });

      expect(getByRole('button', { name: 'Log Out' })).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { dispatch, store } = createStore();
      dispatch(create({ token, user }));

      const { asFragment } = render(<PageUser />, { store });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user clicks the logout button', () => {
      afterEach(() => { localStorage.clear(); });

      it('should not show a user name', () => {
        const { dispatch, store } = createStore();
        dispatch(create({ token, user }));

        const { getByRole, queryByText } = render(<PageUser />, { store });
        const button = getByRole('button', { name: 'Log Out' });

        userEvent.click(button);

        expect(queryByText(/currently logged in/)).toBeNull();
      });

      it('should update the store', () => {
        const expected = { authenticated: false };

        const { dispatch, getState, store } = createStore();
        dispatch(create({ token, user }));

        const { getByRole } = render(<PageUser />, { store });
        const button = getByRole('button', { name: 'Log Out' });

        userEvent.click(button);

        const state = getState() as { session: Session };

        expect(selector(state)).toEqual(expected);
      });

      it('should clear the stored session', () => {
        localStorage.setItem('session', JSON.stringify({ authenticated: true }));

        const { dispatch, store } = createStore();
        dispatch(create({ token, user }));

        const { getByRole } = render(<PageUser />, { store });
        const button = getByRole('button', { name: 'Log Out' });

        userEvent.click(button);

        expect(localStorage.getItem('session')).toBeNull();
      });
    });
  });
});
