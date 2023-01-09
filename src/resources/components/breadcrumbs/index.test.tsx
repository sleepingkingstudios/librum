import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourcesBreadcrumbs } from './index';
import type { Breadcrumb } from '@components/page';
import { render } from '@test-helpers/rendering';

jest.mock(
  '@components/page/breadcrumbs',
  () => require('@components/page/breadcrumbs/mocks'),
);

describe('<ResourcesBreadcrumbs />', () => {
  const resourceName = 'rareBooks';

  describe('with member: false', () => {
    const action = 'published';
    const member = false;

    it('should generate the breadcrumbs', () => {
      const page = { action, member };
      const { queryAllByRole } = render(
        <ResourcesBreadcrumbs
          page={page}
          resourceName={resourceName}
        />,
        { router: true  },
      );
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
        const page = { action, member };
        const { queryAllByRole } = render(
          <ResourcesBreadcrumbs
            breadcrumbs={breadcrumbs}
            page={page}
            resourceName={resourceName}
          />,
          { router: true  },
        );
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
          const page = { action, breadcrumbs: [] as Breadcrumb[], member };
          const { queryAllByRole } = render(
            <ResourcesBreadcrumbs
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
            />,
            { router: true  },
          );
          const results = queryAllByRole('listitem');

          expect(results).toHaveLength(0);
        });
      });

      describe('with page: { breadcrumbs: value }', () => {
        const page = {
          action,
          breadcrumbs: [
            {
              active: true,
              label: 'Published Books'
            },
          ],
          member,
        };

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = render(
            <ResourcesBreadcrumbs
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
            />,
            { router: true  },
          );
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
          const page = { action, member };
          const { queryAllByRole } = render(
            <ResourcesBreadcrumbs
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
              scope={scope}
            />,
            { router: true  },
          );
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
        const page = { action, member };
        const { queryAllByRole } = render(
          <ResourcesBreadcrumbs
            breadcrumbs={breadcrumbs}
            page={page}
            resourceName={resourceName}
          />,
          { router: true  },
        );
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
          const page = { action, breadcrumbs: [] as Breadcrumb[], member };
          const { queryAllByRole } = render(
            <ResourcesBreadcrumbs
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
            />,
            { router: true  },
          );
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
          action,
          breadcrumbs: [
            {
              active: true,
              label: 'Published Books'
            },
          ],
          member,
        };

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = render(
            <ResourcesBreadcrumbs
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
            />,
            { router: true  },
          );
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
          const page = { action, member };
          const { queryAllByRole } = render(
            <ResourcesBreadcrumbs
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
              scope={scope}
            />,
            { router: true  },
          );
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
        const page = { action, breadcrumbs: [] as Breadcrumb[], member };
        const { queryAllByRole } = render(
          <ResourcesBreadcrumbs
            page={page}
            resourceName={resourceName}
          />,
          { router: true  },
        );
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
        action,
        breadcrumbs: [
          {
            active: true,
            label: 'Published Books'
          },
        ],
        member,
      };

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = render(
          <ResourcesBreadcrumbs
            page={page}
            resourceName={resourceName}
          />,
          { router: true  },
        );
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
        const page = { action, member };
        const { queryAllByRole } = render(
          <ResourcesBreadcrumbs
            page={page}
            resourceName={resourceName}
            scope={scope}
          />,
          { router: true  },
        );
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
        const page = { action, member };
        const { queryAllByRole } = render(
          <ResourcesBreadcrumbs
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
        const page = { action, member };
        const { queryAllByRole } = render(
          <ResourcesBreadcrumbs
            breadcrumbs={breadcrumbs}
            page={page}
            resourceName={resourceName}
            wildcards={wildcards}
          />,
          { router: true },
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
  });
});
