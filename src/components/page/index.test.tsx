import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Page } from './index';

describe('<Page>', () => {
  it('should render the header', () => {
    const defaultTitle = 'Librum';

    render(<Page>Page Content Here...</Page>);

    const header = screen.getByText(defaultTitle);

    expect(header).toBeVisible();
    expect(header).toHaveTextContent('Librum');
    expect(header).toHaveTextContent('Campaign Companion');
  });

  it('should render the footer', () => {
    const footerText = 'What lies beyond the furthest reaches of the sky?';

    render(<Page>Page Content Here...</Page>);

    const footer = screen.getByText(footerText);

    expect(footer).toBeVisible();
  });

  it('should render the contents', () => {
    const content = 'Page Content Here...';

    render(<Page>{ content }</Page>);

    const footer = screen.getByText(content);

    expect(footer).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(<Page>Page Content Here...</Page>);

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with subtitle: value', () => {
    it('should render the header', () => {
      const defaultTitle = 'Librum';
      const subtitle = 'Example Subtitle';

      render(<Page subtitle={subtitle}>Page Content Here...</Page>);

      const header = screen.getByText(defaultTitle);

      expect(header).toBeVisible();
      expect(header).toHaveTextContent(defaultTitle);
      expect(header).toHaveTextContent(subtitle);
    });
  });

  describe('with title: value', () => {
    it('should render the header', () => {
      const title = 'Example Title';

      render(<Page title={title}>Page Content Here...</Page>);

      const header = screen.getByText(title);

      expect(header).toBeVisible();
      expect(header).toHaveTextContent(title);
      expect(header).toHaveTextContent('Campaign Companion');
    });
  });
});
