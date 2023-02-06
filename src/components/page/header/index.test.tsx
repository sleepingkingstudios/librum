import * as React from 'react';

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { PageHeader } from './index';
import { actions } from '@session';
import type { User } from '@session';
import { render } from '@test-helpers/rendering';
import { createStore } from '@test-helpers/store';
import { PageNavigation } from '../navigation';

describe('<PageHeader>', () => {
  it('should display the default title', () => {
    const defaultTitle = 'Librum';

    render(<PageHeader />, { store: true });

    const text = screen.getByText(defaultTitle);

    expect(text).toBeVisible();
  });

  it('should display the default subtitle', () => {
    const defaultSubtitle = 'Campaign Companion';

    render(<PageHeader />, { store: true });

    const text = screen.getByText(defaultSubtitle);

    expect(text).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <PageHeader />,
      { store: true },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with navigation: component', () => {
    const navigation = [
      {
        label: 'Home',
        url: '/',
      },
      {
        label: 'Launch Sites',
        url: '/launch-sites',
      },
      {
        label: 'Rockets',
        items: [
          {
            label: 'Engines',
            url: '/rockets/engines',
          },
          {
            label: 'Fuel Tanks',
            url: '/rockets/fuel-tanks',
          },
        ],
      },
      {
        label: 'Administration',
        items: [
          {
            label: 'Strategies',
            url: '/administration/strategies',
          },
        ],
      },
    ];
    const Navigation = () => (<PageNavigation navigation={navigation} />);

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PageHeader navigation={<Navigation />} />,
        {
          router: true,
          store: true,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with navigation: value', () => {
    const navigation = [
      {
        label: 'Home',
        url: '/',
      },
      {
        label: 'Launch Sites',
        url: '/launch-sites',
      },
      {
        label: 'Rockets',
        items: [
          {
            label: 'Engines',
            url: '/rockets/engines',
          },
          {
            label: 'Fuel Tanks',
            url: '/rockets/fuel-tanks',
          },
        ],
      },
      {
        label: 'Administration',
        items: [
          {
            label: 'Strategies',
            url: '/administration/strategies',
          },
        ],
      },
    ];

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PageHeader navigation={navigation} />,
        {
          router: true,
          store: true,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with subtitle: null', () => {
    it('should not display the subtitle', () => {
      const defaultTitle = 'Librum';

      render(<PageHeader subtitle={null} />, { store: true });

      const text = screen.getByText(defaultTitle);

      expect(text).toBeVisible();
      expect(text).toHaveTextContent(/^Librum$/);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PageHeader />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with subtitle: value', () => {
    const subtitle = 'Example Subtitle';

    it('should display the configured title', () => {
      render(<PageHeader subtitle={subtitle} />, { store: true });

      const text = screen.getByText(subtitle);

      expect(text).toBeVisible();
    });
  });

  describe('with title: value', () => {
    const title = 'Example Title';

    it('should display the configured title', () => {
      render(<PageHeader title={title} />, { store: true });

      const text = screen.getByText(title);

      expect(text).toBeVisible();
    });
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

    it('should match the snapshot', () => {
      const { dispatch, store } = createStore();
      dispatch(create({ token, user }));

      const { asFragment } = render(
        <PageHeader />,
        {
          router: true,
          store,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
