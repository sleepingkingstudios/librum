import * as React from 'react';

import '@testing-library/jest-dom';

import { PageFooter } from './index';
import type {
  Breadcrumb,
  Breadcrumbs,
} from '../breadcrumbs';
import { render } from '@test-helpers/rendering';

describe('<PageFooter>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<PageFooter />);

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with breadcrumbs: value', () => {
    const breadcrumbs: Breadcrumbs = [
      {
        label: 'Home',
        url: '/',
      },
      {
        label: 'Admin'
      },
      {
        label: 'Example',
        url: '/example',
      },
    ];

    it('should match the snapshot', () => {
      const { asFragment, getByText } = render(
        <PageFooter breadcrumbs={breadcrumbs} />,
        { router: true }
      );

      breadcrumbs.forEach((breadcrumb: Breadcrumb) => {
        const { label } = breadcrumb;

        expect(getByText(label)).toBeVisible();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
