import * as React from 'react';

import '@testing-library/jest-dom';

import { PageBreadcrumbs } from './index';
import type { Breadcrumb } from './types';
import { render } from '@test-helpers/rendering';

describe('<PageBreadcrumbs />', () => {
  describe('with breadcrumbs: an empty array', () => {
    const breadcrumbs: Breadcrumb[] = [];

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PageBreadcrumbs breadcrumbs={breadcrumbs} />,
        { router: true }
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with breadcrumbs: an array of breadcrumbs', () => {
    const breadcrumbs: Breadcrumb[] = [
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
        <PageBreadcrumbs breadcrumbs={breadcrumbs} />,
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
