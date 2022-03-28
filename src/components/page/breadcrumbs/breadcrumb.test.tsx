import * as React from 'react';

import '@testing-library/jest-dom';

import { PageBreadcrumb } from './breadcrumb';
import type { Breadcrumb } from './types';
import { render } from '@test-helpers/rendering';

describe('<PageBreadcrumb />', () => {
  describe('with url: undefined', () => {
    const breadcrumb: Breadcrumb = { label: 'The Void' };

    it('should match the snapshot', () => {
      const { asFragment, getByText, queryByRole } = render(
        <PageBreadcrumb breadcrumb={breadcrumb} />,
        { router: true },
      );

      expect(getByText(breadcrumb.label)).toBeVisible();
      expect(queryByRole('link', { name: breadcrumb.label })).toBeNull();

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with url: value', () => {
    const breadcrumb: Breadcrumb = { label: 'The Void', url: '/the-void' };

    describe('when the current location does not match the url', () => {
      it('should match the snapshot', () => {
        const { asFragment, getByRole } = render(
          <PageBreadcrumb breadcrumb={breadcrumb} />,
          { router: true },
        );
        const link = getByRole('link', { name: breadcrumb.label });

        expect(link).toBeVisible();
        expect(link).toHaveAttribute('href', breadcrumb.url);

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the current location matches the url', () => {
      it('should match the snapshot', () => {
        const { asFragment, getByText, queryByRole } = render(
          <PageBreadcrumb breadcrumb={breadcrumb} />,
          {
            initialEntries: ['/the-void'],
            router: true,
          },
        );

        expect(getByText(breadcrumb.label)).toBeVisible();
        expect(queryByRole('link', { name: breadcrumb.label })).toBeNull();

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with url: value and active: false', () => {
    const breadcrumb: Breadcrumb = {
      active: false,
      label: 'The Void',
      url: '/the-void',
    };

    describe('when the current location does not match the url', () => {
      it('should match the snapshot', () => {
        const { asFragment, getByText, queryByRole } = render(
          <PageBreadcrumb breadcrumb={breadcrumb} />,
          { router: true },
        );

        expect(getByText(breadcrumb.label)).toBeVisible();
        expect(queryByRole('link', { name: breadcrumb.label })).toBeNull();

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the current location matches the url', () => {
      it('should match the snapshot', () => {
        const { asFragment, getByText, queryByRole } = render(
          <PageBreadcrumb breadcrumb={breadcrumb} />,
          {
            initialEntries: ['/the-void'],
            router: true,
          },
        );

        expect(getByText(breadcrumb.label)).toBeVisible();
        expect(queryByRole('link', { name: breadcrumb.label })).toBeNull();

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with url: value and active: true', () => {
    const breadcrumb: Breadcrumb = {
      active: true,
      label: 'The Void',
      url: '/the-void',
    };

    describe('when the current location does not match the url', () => {
      it('should match the snapshot', () => {
        const { asFragment, getByRole } = render(
          <PageBreadcrumb breadcrumb={breadcrumb} />,
          { router: true },
        );
        const link = getByRole('link', { name: breadcrumb.label });

        expect(link).toBeVisible();
        expect(link).toHaveAttribute('href', breadcrumb.url);

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the current location matches the url', () => {
      it('should match the snapshot', () => {
        const { asFragment, getByRole } = render(
          <PageBreadcrumb breadcrumb={breadcrumb} />,
          {
            initialEntries: ['/the-void'],
            router: true,
          },
        );
        const link = getByRole('link', { name: breadcrumb.label });

        expect(link).toBeVisible();
        expect(link).toHaveAttribute('href', breadcrumb.url);

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
