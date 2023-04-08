import * as React from 'react';

import '@testing-library/jest-dom';

import { render } from './rendering';
import { createStore } from './store';
import type { User } from '@session';
import { actions } from '@session/reducer';

// eslint-disable-next-line jest/no-export
export const shouldNotRenderRoute = (
  Routes: () => JSX.Element,
  { at }: { at: string },
): void => {
  describe(`with path "${at}"`, () => {
    beforeEach(() => {
      // Silence React Router warning about empty leaf node.
      jest
        .spyOn(console, 'warn')
        .mockImplementation(() => null);
    });

    it('should not match the route', () => {
      const { queryByText } = render(
        <Routes />,
        {
          initialEntries: [at],
          router: true,
        },
      );

      expect(queryByText(/./)).toBeNull();
    });
  });
};

// eslint-disable-next-line jest/no-export
export const shouldRenderAuthenticatedRoute = (
  Routes: () => JSX.Element,
  { at, content }: { at: string, content: string },
): void => {
  describe(`with path "${at}"`, () => {
    it('should render the login page', () => {
      const { getByText } = render(
        <Routes />,
        {
          initialEntries: [at],
          router: true,
          store: true,
        },
      );

      const text = getByText('Login Page');

      expect(text).toBeVisible();
    });

    describe('with an authenticated session', () => {
      const user: User = {
        email: 'alan.bradley@example.com',
        id: '00000000-0000-0000-0000-000000000000',
        role: 'user',
        slug: 'alan-bradley',
        username: 'Alan Bradley',
      };
      const token = '12345';
      const { create } = actions;
      const action = create({ token, user });

      it(`should render the ${content.toLowerCase()}`, () => {
        const { dispatch, store } = createStore();

        dispatch(action);

        const { getByText } = render(
          <Routes />,
          {
            initialEntries: [at],
            router: true,
            store,
          },
        );

        const text = getByText(content);

        expect(text).toBeVisible();
      });
    });
  });
};

// eslint-disable-next-line jest/no-export
export const shouldRenderRoute = (
  Routes: () => JSX.Element,
  { at, content }: { at: string, content: string },
): void => {
  describe(`with path "${at}"`, () => {
    it(`should render the ${content.toLowerCase()}`, () => {
      const { getByText } = render(
        <Routes />,
        {
          initialEntries: [at],
          router: true,
        },
      );

      const text = getByText(content);

      expect(text).toBeVisible();
    });
  });
};
