import * as React from 'react';

import '@testing-library/jest-dom';

import { NotFoundPage } from './index';
import type { NavigationProps } from '@components/page';
import { render } from '@test-helpers/rendering';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));

describe('<NotFoundPage>', () => {
  it('should navigate back to the home page', () => {
    const { getByRole } = render(<NotFoundPage />, { router: true });
    const link = getByRole('link', { name: 'Turn Back' });

    expect(link).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <NotFoundPage />,
      { router: true }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with navigation: value', () => {
    const navigation: NavigationProps = [
      { label: 'Nav Item', url: '/' },
      { label: 'Dropdown', items: [{ label: 'Dropdown Item', url: '/' }] },
    ];

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <NotFoundPage navigation={navigation} />,
        { router: true }
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
