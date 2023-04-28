import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourcePageBreadcrumbs } from './breadcrumbs';
import type { Breadcrumb } from '@components/page';
import { render } from '@test-helpers/rendering';

jest.mock(
  '@components/page/breadcrumbs',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => require('@components/page/breadcrumbs/mocks'),
);

type PageOptions = {
  breadcrumbs?: Breadcrumb[],
  member?: boolean,
};

describe('<ResourcePageBreadcrumbs />', () => {
  const resourceName = 'rareBooks';

  describe('with a collection action', () => {
    const member = false;
    const renderBreadcrumbs = ({
      action = 'published',
      page,
      ...options
    }: {
      action?: string,
      breadcrumbs?: Breadcrumb[],
      data?: Record<string, unknown>,
      page: PageOptions,
      scope?: string,
      status?: string,
      wildcards?: Record<string, string>,
    }) => render(
      <ResourcePageBreadcrumbs
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

    it('should match the snapshot', () => {
      const { asFragment } = renderBreadcrumbs({ page });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with action: an empty string', () => {
      const action = '';

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ action, page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Rare Books (active)',
        ];

        expect(results).toHaveLength(2);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ action, page });

        expect(asFragment()).toMatchSnapshot();
      });
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

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with page: { breadcrumbs: empty array }', () => {
        it('should generate the breadcrumbs', () => {
          const page = { breadcrumbs: [] as Breadcrumb[], member };
          const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
          const results = queryAllByRole('listitem');

          expect(results).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
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

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
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

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ breadcrumbs, page, scope });

          expect(asFragment()).toMatchSnapshot();
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

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

        expect(asFragment()).toMatchSnapshot();
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

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
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

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
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

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ breadcrumbs, page, scope });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { breadcrumbs: empty array }', () => {
      const page = { breadcrumbs: [] as Breadcrumb[], member };

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
        ];

        expect(results).toHaveLength(1);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page });

        expect(asFragment()).toMatchSnapshot();
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

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page });

        expect(asFragment()).toMatchSnapshot();
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

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page, scope });

        expect(asFragment()).toMatchSnapshot();
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
          <ResourcePageBreadcrumbs
            action="published"
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

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcePageBreadcrumbs
            action="published"
            breadcrumbs={breadcrumbs}
            page={page}
            resourceName={resourceName}
          />,
          {
            initialEntries: ['/path/lending-library/resource'],
            router: { path: 'path/:namespace/resource' },
          },
        );

        expect(asFragment()).toMatchSnapshot();
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

      it('should match the snapshot', () => {
        const { asFragment } =
          renderBreadcrumbs({ breadcrumbs, page, wildcards });

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with a member action', () => {
    const member = true;
    const renderBreadcrumbs = ({
      action = 'publish',
      page,
      ...options
    }: {
      action?: string,
      breadcrumbs?: Breadcrumb[],
      data?: Record<string, unknown>,
      page: PageOptions,
      scope?: string,
      singularName?: string,
      status?: string,
      wildcards?: Record<string, string>,
    }) => render(
      <ResourcePageBreadcrumbs
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
        'Loading',
        'Publish (active)',
      ];

      expect(results).toHaveLength(4);
      expect(results.map((result) => result.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderBreadcrumbs({ page });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with action: an empty string', () => {
      const action = '';

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ action, page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Loading (active)',
        ];

        expect(results).toHaveLength(3);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ action, page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } =
            renderBreadcrumbs({ action, page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Rare Books @ /rare-books',
            'Rare Book (active)',
          ];

          expect(results).toHaveLength(3);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ action, page, status });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with data: value', () => {
          const data = {
            rareBook: {
              name: 'On War',
              slug: 'on-war',
            },
          };

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ action, data, page, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Home @ /',
              'Rare Books @ /rare-books',
              'On War (active)',
            ];

            expect(results).toHaveLength(3);
            expect(results.map((result) => result.textContent)).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } = renderBreadcrumbs({ data, page, status });

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with breadcrumbs: empty array', () => {
      const breadcrumbs: Breadcrumb[] = [];

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Rare Books @ /rare-books',
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(3);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with page: { breadcrumbs: empty array }', () => {
        it('should generate the breadcrumbs', () => {
          const page = { breadcrumbs: [] as Breadcrumb[], member };
          const { queryAllByRole } = renderBreadcrumbs({ breadcrumbs, page });
          const results = queryAllByRole('listitem');

          expect(results).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with status: "success"', () => {
          const status = 'success';

          it('should generate the breadcrumbs', () => {
            const page = { breadcrumbs: [] as Breadcrumb[], member };
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, page, status });
            const results = queryAllByRole('listitem');

            expect(results).toHaveLength(0);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, page, status });

            expect(asFragment()).toMatchSnapshot();
          });
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

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with status: "success"', () => {
          const status = 'success';

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, page, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Published Books (active)',
            ];

            expect(results).toHaveLength(1);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, page, status });

            expect(asFragment()).toMatchSnapshot();
          });
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
            'Loading',
            'Publish (active)',
          ];

          expect(results).toHaveLength(3);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ breadcrumbs, page, scope });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with status: "success"', () => {
          const status = 'success';

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, page, scope, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Rare Books @ /rare-books',
              'Rare Book',
              'Publish (active)',
            ];

            expect(results).toHaveLength(3);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, page, scope, status });

            expect(asFragment()).toMatchSnapshot();
          });

          describe('with data: value', () => {
            const data = {
              rareBook: {
                name: 'On War',
                slug: 'on-war',
              },
            };

            it('should generate the breadcrumbs', () => {
              const { queryAllByRole } =
                renderBreadcrumbs({ breadcrumbs, data, page, scope, status });
              const results = queryAllByRole('listitem');
              const expected = [
                'Rare Books @ /rare-books',
                'On War @ /rare-books/on-war',
                'Publish (active)',
              ];

              expect(results).toHaveLength(3);
              expect(
                results.map((result) => result.textContent)
              ).toEqual(expected);
            });

            it('should match the snapshot', () => {
              const { asFragment } =
                renderBreadcrumbs({ breadcrumbs, data, page, scope, status });

              expect(asFragment()).toMatchSnapshot();
            });
          });
        });
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } =
            renderBreadcrumbs({ breadcrumbs, page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Rare Books @ /rare-books',
            'Rare Book',
            'Publish (active)',
          ];

          expect(results).toHaveLength(3);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ breadcrumbs, page, status });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with data: value', () => {
          const data = {
            rareBook: {
              name: 'On War',
              slug: 'on-war',
            },
          };

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, data, page, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Rare Books @ /rare-books',
              'On War @ /rare-books/on-war',
              'Publish (active)',
            ];

            expect(results).toHaveLength(3);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, data, page, status });

            expect(asFragment()).toMatchSnapshot();
          });
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
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(5);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

        expect(asFragment()).toMatchSnapshot();
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

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with status: "success"', () => {
          const status = 'success';

          it('should generate the breadcrumbs', () => {
            const page = { breadcrumbs: [] as Breadcrumb[], member };
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, page, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Custom',
              'Path @ /custom/path',
            ];

            expect(results).toHaveLength(2);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, page, status });

            expect(asFragment()).toMatchSnapshot();
          });
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

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ breadcrumbs, page });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with status: "success"', () => {
          const status = 'success';

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, page, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Custom',
              'Path @ /custom/path',
              'Published Books (active)',
            ];

            expect(results).toHaveLength(3);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, page, status });

            expect(asFragment()).toMatchSnapshot();
          });
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
            'Loading',
            'Publish (active)',
          ];

          expect(results).toHaveLength(5);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ breadcrumbs, page, scope });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with status: "success"', () => {
          const status = 'success';

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, page, scope, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Custom',
              'Path @ /custom/path',
              'Rare Books @ /custom/path/rare-books',
              'Rare Book',
              'Publish (active)',
            ];

            expect(results).toHaveLength(5);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, page, scope, status });

            expect(asFragment()).toMatchSnapshot();
          });

          describe('with data: value', () => {
            const data = {
              rareBook: {
                name: 'On War',
                slug: 'on-war',
              },
            };

            it('should generate the breadcrumbs', () => {
              const { queryAllByRole } =
                renderBreadcrumbs({ breadcrumbs, data, page, scope, status });
              const results = queryAllByRole('listitem');
              const expected = [
                'Custom',
                'Path @ /custom/path',
                'Rare Books @ /custom/path/rare-books',
                'On War @ /custom/path/rare-books/on-war',
                'Publish (active)',
              ];

              expect(results).toHaveLength(5);
              expect(
                results.map((result) => result.textContent)
              ).toEqual(expected);
            });

            it('should match the snapshot', () => {
              const { asFragment } =
                renderBreadcrumbs({ breadcrumbs, data, page, scope, status });

              expect(asFragment()).toMatchSnapshot();
            });
          });
        });
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } =
            renderBreadcrumbs({ breadcrumbs, page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Custom',
            'Path @ /custom/path',
            'Rare Books @ /custom/path/rare-books',
            'Rare Book',
            'Publish (active)',
          ];

          expect(results).toHaveLength(5);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ breadcrumbs, page, status });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with data: value', () => {
          const data = {
            rareBook: {
              name: 'On War',
              slug: 'on-war',
            },
          };

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, data, page, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Custom',
              'Path @ /custom/path',
              'Rare Books @ /custom/path/rare-books',
              'On War @ /custom/path/rare-books/on-war',
              'Publish (active)',
            ];

            expect(results).toHaveLength(5);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, data, page, status });

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with page: { breadcrumbs: empty array }', () => {
      const page = { breadcrumbs: [] as Breadcrumb[], member };

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
        ];

        expect(results).toHaveLength(1);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
          ];

          expect(results).toHaveLength(1);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ page, status });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { breadcrumbs: value }', () => {
      const page = {
        breadcrumbs: [
          {
            active: true,
            label: 'Publish Book'
          },
        ],
        member,
      };

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Publish Book (active)',
        ];

        expect(results).toHaveLength(2);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Publish Book (active)',
          ];

          expect(results).toHaveLength(2);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ page, status });

          expect(asFragment()).toMatchSnapshot();
        });
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
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(5);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page, scope });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ page, scope, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Lending Library @ /lending-library',
            'Rare Books @ /lending-library/rare-books',
            'Rare Book',
            'Publish (active)',
          ];

          expect(results).toHaveLength(5);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ page, scope, status });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with data: value', () => {
          const data = {
            rareBook: {
              name: 'On War',
              slug: 'on-war',
            },
          };

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ data, page, scope, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Home @ /',
              'Lending Library @ /lending-library',
              'Rare Books @ /lending-library/rare-books',
              'On War @ /lending-library/rare-books/on-war',
              'Publish (active)',
            ];

            expect(results).toHaveLength(5);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ data, page, scope, status });

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with singularName: value', () => {
      const singularName = 'rareTome';

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page, singularName });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page, singularName });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } =
            renderBreadcrumbs({ page, singularName, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Rare Books @ /rare-books',
            'Rare Tome',
            'Publish (active)',
          ];

          expect(results).toHaveLength(4);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ page, singularName, status });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with data: value', () => {
          const data = {
            rareTome: {
              name: 'On War',
              slug: 'on-war',
            },
          };

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ data, page, singularName, status });
            const results = queryAllByRole('listitem');
            const expected = [
              'Home @ /',
              'Rare Books @ /rare-books',
              'On War @ /rare-books/on-war',
              'Publish (active)',
            ];

            expect(results).toHaveLength(4);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ data, page, singularName, status });

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with status: "loading"', () => {
      const status = 'loading';

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page, status });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page, status });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with status: "failure"', () => {
      const status = 'failure';

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page, status });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page, status });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with status: "success"', () => {
      const status = 'success';

      it('should generate the breadcrumbs', () => {
        const { queryAllByRole } = renderBreadcrumbs({ page, status });
        const results = queryAllByRole('listitem');
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Rare Book',
          'Publish (active)',
        ];

        expect(results).toHaveLength(4);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderBreadcrumbs({ page, status });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with data: value with name', () => {
        const data = {
          rareBook: {
            name: 'On War',
          },
        };

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ data, page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Rare Books @ /rare-books',
            'On War',
            'Publish (active)',
          ];

          expect(results).toHaveLength(4);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ data, page, status });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with data: value with name and id', () => {
        const data = {
          rareBook: {
            id: '00000000-0000-0000-0000-000000000000',
            name: 'On War',
          },
        };

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ data, page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Rare Books @ /rare-books',
            'On War @ /rare-books/00000000-0000-0000-0000-000000000000',
            'Publish (active)',
          ];

          expect(results).toHaveLength(4);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ data, page, status });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with data: value with name and slug', () => {
        const data = {
          rareBook: {
            name: 'On War',
            slug: 'on-war',
          },
        };

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = renderBreadcrumbs({ data, page, status });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Rare Books @ /rare-books',
            'On War @ /rare-books/on-war',
            'Publish (active)',
          ];

          expect(results).toHaveLength(4);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderBreadcrumbs({ data, page, status });

          expect(asFragment()).toMatchSnapshot();
        });
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
          <ResourcePageBreadcrumbs
            action="publish"
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
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(5);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcePageBreadcrumbs
            action="publish"
            breadcrumbs={breadcrumbs}
            page={page}
            resourceName={resourceName}
          />,
          {
            initialEntries: ['/path/lending-library/resource'],
            router: { path: 'path/:namespace/resource' },
          },
        );

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } = render(
            <ResourcePageBreadcrumbs
              action="publish"
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
              status={status}
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
            'Rare Book',
            'Publish (active)',
          ];

          expect(results).toHaveLength(5);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = render(
            <ResourcePageBreadcrumbs
              action="publish"
              breadcrumbs={breadcrumbs}
              page={page}
              resourceName={resourceName}
              status={status}
            />,
            {
              initialEntries: ['/path/lending-library/resource'],
              router: { path: 'path/:namespace/resource' },
            },
          );

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with data: value', () => {
          const data = {
            rareBook: {
              name: 'On War',
              slug: 'on-war',
            },
          };

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } = render(
              <ResourcePageBreadcrumbs
                action="publish"
                breadcrumbs={breadcrumbs}
                data={data}
                page={page}
                resourceName={resourceName}
                status={status}
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
              'On War @ /lending-library/rare-books/on-war',
              'Publish (active)',
            ];

            expect(results).toHaveLength(5);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } = render(
              <ResourcePageBreadcrumbs
                action="publish"
                breadcrumbs={breadcrumbs}
                data={data}
                page={page}
                resourceName={resourceName}
                status={status}
              />,
              {
                initialEntries: ['/path/lending-library/resource'],
                router: { path: 'path/:namespace/resource' },
              },
            );

            expect(asFragment()).toMatchSnapshot();
          });
        });
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
          'Loading',
          'Publish (active)',
        ];

        expect(results).toHaveLength(5);
        expect(results.map((result) => result.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          renderBreadcrumbs({ breadcrumbs, page, wildcards });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with status: "success"', () => {
        const status = 'success';

        it('should generate the breadcrumbs', () => {
          const { queryAllByRole } =
            renderBreadcrumbs({ breadcrumbs, page, status, wildcards });
          const results = queryAllByRole('listitem');
          const expected = [
            'Home @ /',
            'Namespace @ /lending-library',
            'Rare Books @ /lending-library/rare-books',
            'Rare Book',
            'Publish (active)',
          ];

          expect(results).toHaveLength(5);
          expect(results.map((result) => result.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            renderBreadcrumbs({ breadcrumbs, page, status, wildcards });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with data: value', () => {
          const data = {
            rareBook: {
              name: 'On War',
              slug: 'on-war',
            },
          };

          it('should generate the breadcrumbs', () => {
            const { queryAllByRole } =
              renderBreadcrumbs({ breadcrumbs, data, page, status, wildcards });
            const results = queryAllByRole('listitem');
            const expected = [
              'Home @ /',
              'Namespace @ /lending-library',
              'Rare Books @ /lending-library/rare-books',
              'On War @ /lending-library/rare-books/on-war',
              'Publish (active)',
            ];

            expect(results).toHaveLength(5);
            expect(
              results.map((result) => result.textContent)
            ).toEqual(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              renderBreadcrumbs({ breadcrumbs, data, page, status, wildcards });

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });
  });
});
