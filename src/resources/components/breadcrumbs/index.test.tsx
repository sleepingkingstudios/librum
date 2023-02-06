import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceBreadcrumbs } from './index';
import type { Breadcrumb } from '@components/page';
import { render } from '@test-helpers/rendering';

jest.mock(
  '@components/page/breadcrumbs',
  () => require('@components/page/breadcrumbs/mocks'),
);

type PageOptions = {
  breadcrumbs?: Breadcrumb[],
  member?: boolean,
};

describe('<ResourceBreadcrumbs />', () => {
  const resourceName = 'rareBooks';

  describe('with member: false', () => {
    const action = 'published';
    const member = false;
    const renderBreadcrumbs = ({
      page,
      ...options
    }: {
      breadcrumbs?: Breadcrumb[],
      page: PageOptions,
      scope?: string,
      wildcards?: Record<string, string>,
    }) => render(
      <ResourceBreadcrumbs
        action={action}
        page={page}
        resourceName={resourceName}
        {...options}
      />,
      { router: true  },
    );
    const page = { member };

    it('should generate the breadcrumbs', () => {
      const { queryAllByRole } = renderBreadcrumbs({ page });
      const results = queryAllByRole('listitem');
      const expected = [
        'Home @ /',
        'Rare Books @ /rare-books',
        'Published (active)',
      ];

      expect(results).toHaveLength(3);
      expect(results.map((result) => result.textContent)).toEqual(expected);
    });

    describe('with breadcrumbs: empty array', () => {
      const breadcrumbs: Breadcrumb[] = [];

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Rare Books @ /rare-books',
          'Published (active)',
        ];

        expect(results).toHaveLength(2);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      describe('with page: { breadcrumbs: empty array }', () => {
        it('should generate the breadcrumbs', () => {
          const page = { breadcrumbs: [] as Breadcrumb[], member };
          const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
          const results = queryAllByRole('listitem');

          expect(results).toHaveLength(0);
        });
      });

      describe('with page: { breadcrumbs: value }', () => {
        const page = {
          breadcrumbs: [
            {
              active: true,
              label: 'Published Books'
            },
          ],
          member,
        };

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
          const results = queryAllByRole('listitem');
          const expected = [
            'Published Books (active)',
          ];

          expect(results).toHaveLength(1);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });
      });

      describe('with scope: value', () => {
        const scope = 'lendingLibrary';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } =
            renderBreadcrumbs({ breadcrumbs, page, scope });
          const results = queryAllByRole('listitem');
          const expected = [
            'Rare Books @ /rare-books',
            'Published (active)',
          ];

          expect(results).toHaveLength(2);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });
      });
    });

    describe('with breadcrumbs: value', () => {
      const breadcrumbs = [
        {
          label: 'Custom',
        },
        {
          label: 'Path',
          url: '/custom/path',
        },
      ];

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Custom',
          'Path @ /custom/path',
          'Rare Books @ /custom/path/rare-books',
          'Published (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      describe('with page: { breadcrumbs: empty array }', () => {
        it('should generate the breadcrumbs', () => {
          const page = { breadcrumbs: [] as Breadcrumb[], member };
          const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
          const results = queryAllByRole('listitem');
          const expected = [
            'Custom',
            'Path @ /custom/path',
          ];

          expect(results).toHaveLength(2);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });
      });

      describe('with page: { breadcrumbs: value }', () => {
        const page = {
          breadcrumbs: [
            {
              active: true,
              label: 'Published Books'
            },
          ],
          member,
        };

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
          const results = queryAllByRole('listitem');
          const expected = [
            'Custom',
            'Path @ /custom/path',
            'Published Books (active)',
          ];

          expect(results).toHaveLength(3);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });
      });

      describe('with scope: value', () => {
        const scope = 'lendingLibrary';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } =
            renderBreadcrumbs({ breadcrumbs, page, scope });
          const results = queryAllByRole('listitem');
          const expected = [
            'Custom',
            'Path @ /custom/path',
            'Rare Books @ /custom/path/rare-books',
            'Published (active)',
          ];

          expect(results).toHaveLength(4);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });
      });
    });

    describe('with page: { breadcrumbs: empty array }', () => {
      it('should generate the breadcrumbs', () => {
        const page = { breadcrumbs: [] as Breadcrumb[], member };
        const { queryAllByRole } = renderBreadcrumbs({ page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
        ];

        expect(results).toHaveLength(1);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });
    });

    describe('with page: { breadcrumbs: value }', () => {
      const page = {
        breadcrumbs: [
          {
            active: true,
            label: 'Published Books'
          },
        ],
        member,
      };

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Published Books (active)',
        ];

        expect(results).toHaveLength(2);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page, scope });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Lending Library @ /lending-library',
          'Rare Books @ /lending-library/rare-books',
          'Published (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });
    });

    describe('with routes wildcards', () => {
      const breadcrumbs: Breadcrumb[] = [
        {
          label: 'Home',
          url: '/',
        },
        {
          label: 'Namespace',
          url: '/:namespace',
        },
      ];

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = render(
          <ResourceBreadcrumbs
            action={action}
            breadcrumbs={breadcrumbs}
            page={page}
            resourceName={resourceName}
          />,
          {
            initialEntries: ['/path/lending-library/resource'],
            router: { path: 'path/:namespace/resource' },
          },
        );
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Namespace @ /lending-library',
          'Rare Books @ /lending-library/rare-books',
          'Published (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });
    });

    describe('with wildcards: value', () => {
      const breadcrumbs: Breadcrumb[] = [
        {
          label: 'Home',
          url: '/',
        },
        {
          label: 'Namespace',
          url: '/:namespace',
        },
      ];
      const wildcards = { namespace: 'lending-library' };

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } =
          renderBreadcrumbs({ breadcrumbs, page, wildcards });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Namespace @ /lending-library',
          'Rare Books @ /lending-library/rare-books',
          'Published (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });
    });
  });
});
