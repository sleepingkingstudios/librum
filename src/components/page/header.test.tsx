import * as React from 'react';

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { PageHeader } from './header';
import { render } from '@test-helpers/rendering';

describe('<PageHeader>', () => {
  const theme = {
    subtitle: 'text-blue-500',
    title: 'text-xs',
  };

  it('should display the default title', () => {
    const defaultTitle = 'Librum';

    render(<PageHeader />);

    const text = screen.getByText(defaultTitle);

    expect(text).toBeVisible();
  });

  it('should display the default subtitle', () => {
    const defaultSubtitle = 'Campaign Companion';

    render(<PageHeader />);

    const text = screen.getByText(defaultSubtitle);

    expect(text).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(<PageHeader />, { theme });

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with subtitle: null', () => {
    it('should not display the subtitle', () => {
      const defaultTitle = 'Librum';

      render(<PageHeader subtitle={null} />);

      const text = screen.getByText(defaultTitle);

      expect(text).toBeVisible();
      expect(text).toHaveTextContent(/^Librum$/);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<PageHeader />, { theme });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with subtitle: value', () => {
    const subtitle = 'Example Subtitle';

    it('should display the configured title', () => {
      render(<PageHeader subtitle={subtitle} />);

      const text = screen.getByText(subtitle);

      expect(text).toBeVisible();
    });
  });

  describe('with title: value', () => {
    const title = 'Example Title';

    it('should display the configured title', () => {
      render(<PageHeader title={title} />);

      const text = screen.getByText(title);

      expect(text).toBeVisible();
    });
  });
});
