import * as React from 'react';

import '@testing-library/jest-dom';

import { render } from './rendering';
import { createStore } from './store';
import type { User } from '@session';
import { actions } from '@session/reducer';

// eslint-disable-next-line jest/no-export
export const shouldRenderContent = (
  Routes: () => JSX.Element,
  { at, content }: { at: string, content: string }
) => {
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
      it(`should render the ${content.toLowerCase()}`, () => {
        const { dispatch, store } = createStore();
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
