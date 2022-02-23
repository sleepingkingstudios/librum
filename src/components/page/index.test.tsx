import * as React from 'react';

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Page } from './index';
import { render } from '@test-helpers/rendering';

describe('<Page>', () => {
  const theme = {
    background: 'bg-[#ff3366]',
    text: 'font-mono',
  };

  it('should render the header', () => {
    const defaultTitle = 'Librum';
    const defaultSubtitle = 'Campaign Companion';

    render(<Page>Page Content Here...</Page>, { router: true });

    expect(screen.getByText(defaultTitle)).toBeVisible();
    expect(screen.getByText(defaultSubtitle)).toBeVisible();
  });

  it('should render the footer', () => {
    const footerText = 'What lies beyond the furthest reaches of the sky?';

    render(<Page>Page Content Here...</Page>, { router: true });

    const footer = screen.getByText(footerText);

    expect(footer).toBeVisible();
  });

  it('should render the contents', () => {
    const content = 'Page Content Here...';

    render(<Page>{ content }</Page>, { router: true });

    const footer = screen.getByText(content);

    expect(footer).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Page>Page Content Here...</Page>,
      { router: true, theme },
    );

    expect(asFragment()).toMatchSnapshot();
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
        { router: true, theme },
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
        { router: true },
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
        { router: true },
      );

      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(defaultSubtitle)).toBeVisible();
    });
  });
});
