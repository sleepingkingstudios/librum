import * as React from 'react';
import { v4 as generateUuid } from 'uuid';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Page } from './index';
import { PageBreadcrumbs } from './breadcrumbs';
import type { Breadcrumb } from './breadcrumbs';
import { AlertsProvider } from '@alerts';
import type { Alert } from '@alerts';
import { actions } from '@session';
import type { User } from '@session';
import { render } from '@test-helpers/rendering';
import { createStore } from '@test-helpers/store';
import { PageNavigation } from './navigation';

describe('<Page>', () => {
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

    const contents = screen.getByText(content);

    expect(contents).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Page>Page Content Here...</Page>,
      {
        router: true,
        store: true,
        theme: true,
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with breadcrumbs: component', () => {
    const breadcrumbs: Breadcrumb[] = [
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
    const Breadcrumbs = () => (<PageBreadcrumbs breadcrumbs={breadcrumbs} />);

    it('should render the footer', () => {
      const footerText = 'What lies beyond the furthest reaches of the sky?';

      const { getByText } = render(
        <Page breadcrumbs={<Breadcrumbs />}>Page Content Here...</Page>,
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
        <Page breadcrumbs={<Breadcrumbs />}>Page Content Here...</Page>,
        {
          router: true,
          store: true,
          theme: true,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with breadcrumbs: value', () => {
    const breadcrumbs: Breadcrumb[] = [
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
          theme: true,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
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
        <Page navigation={<Navigation />}>Page Content Here...</Page>,
        {
          router: true,
          store: true,
          theme: true,
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
          theme: true,
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
          theme: true,
        },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there are many alerts', () => {
    const alerts: Alert[] = [
      {
        dismissable: true,
        message: 'Successfully activated reactor',
        persistent: false,
        type: 'success',
        uuid: generateUuid(),
      },
      {
        dismissable: false,
        icon: faRadiation,
        message: 'Reactor overheat imminent',
        persistent: false,
        type: 'warning',
        uuid: generateUuid(),
      },
      {
        dismissable: false,
        message: 'Increase in three-eyed fish observed',
        persistent: true,
        type: 'failure',
        uuid: generateUuid(),
      },
    ];

    it('should render the alerts', () => {
      const { getByText } = render(
        <AlertsProvider initialValue={alerts}>
          <Page>Page Content Here...</Page>
        </AlertsProvider>,
        {
          router: true,
          store: true,
        }
      );

      alerts.forEach((alert) => {
        const { message } = alert;
        const rendered = getByText(message);

        expect(rendered).toBeVisible();
      });
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <AlertsProvider initialValue={alerts}>
          <Page>Page Content Here...</Page>
        </AlertsProvider>,
        {
          router: true,
          store: true,
        }
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
