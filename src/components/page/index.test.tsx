import * as React from 'react';

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Page } from './index';
import type {
  Breadcrumb,
  Breadcrumbs,
} from './breadcrumbs';
import { actions } from '@session';
import type { User } from '@session';
import { render } from '@test-helpers/rendering';
import { createStore } from '@test-helpers/store';

describe('<Page>', () => {
  const theme = {
    background: 'bg-[#ff3366]',
    text: 'font-mono',
  };

  it('should render the header', () => {
    const defaultTitle = 'Librum';
    const defaultSubtitle = 'Campaign Companion';

    render(
      <Page>Page Content Here...</Page>,
      {
        router: true,
        store: true,
      }
    );

    expect(screen.getByText(defaultTitle)).toBeVisible();
    expect(screen.getByText(defaultSubtitle)).toBeVisible();
  });

  it('should render the footer', () => {
    const footerText = 'What lies beyond the furthest reaches of the sky?';

    render(
      <Page>Page Content Here...</Page>,
      {
        router: true,
        store: true,
      }
    );

    const footer = screen.getByText(footerText);

    expect(footer).toBeVisible();
  });

  it('should render the contents', () => {
    const content = 'Page Content Here...';

    render(
      <Page>Page Content Here...</Page>,
      {
        router: true,
        store: true,
      }
    );

    const footer = screen.getByText(content);

    expect(footer).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Page>Page Content Here...</Page>,
      {
        router: true,
        store: true,
        theme,
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with breadcrumbs: value', () => {
    const breadcrumbs: Breadcrumbs = [
      {
        label: 'Breadcrumb One',
        url: '/',
      },
      {
        label: 'Breadcrumb Two'
      },
      {
        label: 'Breadcrumb Three',
        url: '/example',
      },
    ];

    it('should render the footer', () => {
      const footerText = 'What lies beyond the furthest reaches of the sky?';

      const { getByText } = render(
        <Page breadcrumbs={breadcrumbs}>Page Content Here...</Page>,
        {
          router: true,
          store: true,
        }
      );

      const footer = getByText(footerText);

      expect(footer).toBeVisible();

      breadcrumbs.forEach((breadcrumb: Breadcrumb) => {
        const { label } = breadcrumb;

        expect(getByText(label)).toBeVisible();
      });
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Page breadcrumbs={breadcrumbs}>Page Content Here...</Page>,
        {
          router: true,
          store: true,
          theme,
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
        <Page navigation={navigation}>Page Content Here...</Page>,
        {
          router: true,
          store: true,
          theme,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with subtitle: value', () => {
    it('should render the header', () => {
      const defaultTitle = 'Librum';
      const subtitle = 'Example Subtitle';

      render(
        <Page subtitle={subtitle}>Page Content Here...</Page>,
        {
          router: true,
          store: true,
        },
      );

      expect(screen.getByText(defaultTitle)).toBeVisible();
      expect(screen.getByText(subtitle)).toBeVisible();
    });
  });

  describe('with title: value', () => {
    it('should render the header', () => {
      const title = 'Example Title';
      const defaultSubtitle = 'Campaign Companion';

      render(
        <Page title={title}>Page Content Here...</Page>,
        {
          router: true,
          store: true,
        },
      );

      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(defaultSubtitle)).toBeVisible();
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
        <Page>Page Content Here...</Page>,
        {
          router: true,
          store,
          theme,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
