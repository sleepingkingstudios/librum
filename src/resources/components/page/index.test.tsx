import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourcePage } from './index';
import {
  responseWithData,
  responseWithStatus,
} from '@api';
import type { Response } from '@api';
import { ButtonProps as Button } from '@components/button';
import type { Breadcrumb } from '@components/page';
import { render } from '@test-helpers/rendering';
import { singularize } from '@utils/inflector';
import type { ResourcePageOptions } from './types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page/breadcrumbs', () => require('@components/page/breadcrumbs/mocks'));

describe('<ResourcePage />', () => {
  const resourceName = 'rareBooks';

  describe('with a collection action', () => {
    const member = false;
    const renderPage = ({
      action = 'published',
      page,
      ...options
    }: {
      action?: string,
      breadcrumbs?: Breadcrumb[],
      data?: Record<string, unknown>, // @TODO: Remove this.
      contents?: JSX.Element | React.ComponentType,
      page: ResourcePageOptions,
      response?: Response,
      scope?: string,
      status?: string, // @TODO: Remove this.
    }) => render(
      <ResourcePage
        action={action}
        page={page}
        resourceName={resourceName}
        {...options}
      />
    );
    const page: ResourcePageOptions = { member };

    it('should display the breadcrumbs', () => {
      const { getAllByRole } = renderPage({ page });
      const expected = [
        'Home @ /',
        'Rare Books @ /rare-books',
        'Published (active)',
      ];

      const rendered = getAllByRole('listitem');

      expect(rendered).toHaveLength(3);
      expect(rendered.map(item => item.textContent)).toEqual(expected);
    });

    it('should display the heading', () => {
      const { getByRole } = renderPage({ page });

      const heading = getByRole('heading');

      expect(heading).toBeVisible();
      expect(heading).toHaveTextContent('Published Rare Books');
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderPage({ page });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with action: an empty string', () => {
      const action = '';

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ action, page });
        const expected = [
          'Home @ /',
          'Rare Books (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(2);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ action, page });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Rare Books');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ action, page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with breadcrumbs: value', () => {
      const breadcrumbs: Breadcrumb[] = [
        {
          label: 'Lending Library',
          url: '/lending-library',
        },
      ];

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ breadcrumbs, page });
        const expected = [
          'Lending Library @ /lending-library',
          'Rare Books @ /lending-library/rare-books',
          'Published (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ breadcrumbs, page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with contents: component', () => {
      const Contents = ({
        resourceName,
        response,
      }: {
        resourceName: string,
        response: Response,
      }): JSX.Element => {
        const data = (response.data || {}) as Record<string, unknown[]>;
        const { status } = response;
        const items: unknown[] = data[resourceName] || [];
        const message = `There are ${items.length} ${resourceName} (${status})`;

        return (<span>{ message }</span>);
      };
      const page: ResourcePageOptions = { contents: Contents, member };

      it('should display the contents', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('There are 0 rareBooks (uninitialized)');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with afterContents: component', () => {
        const AfterContents = ({
          resourceName,
        }: {
          resourceName: string,
        }): JSX.Element => {
          return (<span>After { resourceName }</span>);
        };
        const page: ResourcePageOptions = {
          afterContents: AfterContents,
          contents: Contents,
          member,
        };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(
            getByText('There are 0 rareBooks (uninitialized)')
          ).toBeVisible();
          expect(getByText('After rareBooks')).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with beforeContents: component', () => {
        const BeforeContents = ({
          resourceName,
        }: {
          resourceName: string,
        }): JSX.Element => {
          return (<span>Before { resourceName }</span>);
        };
        const page: ResourcePageOptions = {
          beforeContents: BeforeContents,
          contents: Contents,
          member,
        };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(getByText('Before rareBooks')).toBeVisible();
          expect(
            getByText('There are 0 rareBooks (uninitialized)')
          ).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBooks: [
            { title: 'Gideon the Ninth' },
            { title: 'Harrow the Ninth' },
            { title: 'Nona the Ninth' },
          ],
        };
        const response = responseWithData({ data });

        it('should display the contents', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('There are 3 rareBooks (success)');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: value }', () => {
        const response = responseWithStatus({ status: 'loading' });

        it('should display the contents', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('There are 0 rareBooks (loading)');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with contents: element', () => {
      const contents = (<span>Custom Contents</span>);
      const page: ResourcePageOptions = { contents, member };

      it('should display the contents', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('Custom Contents');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const page: ResourcePageOptions = { contents };
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with afterContents: element', () => {
        const afterContents = (<span>After Contents</span>);
        const page: ResourcePageOptions = { afterContents, contents, member };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(getByText('After Contents')).toBeVisible();
          expect(getByText('Custom Contents')).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with beforeContents: element', () => {
        const beforeContents = (<span>Before Contents</span>);
        const page: ResourcePageOptions = { beforeContents, contents, member };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(getByText('Before Contents')).toBeVisible();
          expect(getByText('Custom Contents')).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { breadcrumbs: element }', () => {
      const breadcrumbs = (<span>Custom Breadcrumbs</span>);
      const page: ResourcePageOptions = { breadcrumbs, member };

      it('should display the custom breadcrumbs', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('Custom Breadcrumbs');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with page: { breadcrumbs: value }', () => {
      const breadcrumbs: Breadcrumb[] = [
        {
          label: 'Published Rare Books',
          active: true,
        },
      ];
      const page: ResourcePageOptions = { breadcrumbs, member };

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page });
        const expected = [
          'Home @ /',
          'Published Rare Books (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(2);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with page: { buttons: value }', () => {
      const buttons: Button[] = [
        {
          label: 'Rock',
          type: 'primary',
        },
        {
          label: 'Paper',
          type: 'success',
        },
        {
          label: 'Scissors',
          type: 'danger',
        },
      ];
      const page: ResourcePageOptions = { buttons, member };

      it('should display the buttons', () => {
        const { getAllByRole } = renderPage({ page });
        const expected = ['Rock', 'Paper', 'Scissors'];

        const rendered = getAllByRole('button');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(button => button.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with page: { heading: value }', () => {
      const page: ResourcePageOptions = {
        heading: 'Rare Publications',
        member,
      };

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Rare Publications');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with page: { navigation: element }', () => {
      const navigation = (<span>Custom Navigation</span>);
      const page: ResourcePageOptions = { member, navigation };

      it('should display the custom navigation', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('Custom Navigation');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with page: { navigation: value }', () => {
      const navigation = [
        {
          label: 'Nav Item',
          url: '/nav-item',
        },
        {
          label: 'Dropdown',
          items: [
            {
              label: 'Dropdown Item',
              url: '/dropdown-item',
            },
          ],
        },
      ];
      const page = { member, navigation };

      it('should display the navigation', () => {
        const { getAllByRole } = renderPage({ page });
        const expected = [
          'Nav Item @ /nav-item',
          'Dropdown Item @ /dropdown-item',
        ];

        const rendered = getAllByRole('listitem', { name: 'navigation-item' });

        expect(rendered).toHaveLength(2);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with page: { title: value }', () => {
      const title = 'Rare Books';
      const page = { member, title };

      it('should display the title', () => {
        const { getByLabelText } = renderPage({ page });

        const rendered = getByLabelText('title');

        expect(rendered).toBeVisible();
        expect(rendered).toHaveTextContent('Rare Books');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with page: { subtitle: value }', () => {
        const subtitle = 'the Publishing';
        const page = { member, subtitle, title };

        it('should display the title and subtitle', () => {
          const { getByLabelText } = renderPage({ page });

          const rendered = getByLabelText('title');

          expect(rendered).toBeVisible();
          expect(rendered).toHaveTextContent('Rare Books: the Publishing');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with response: { data: value }', () => {
      const data = {
        rareBooks: [
          { title: 'Gideon the Ninth' },
          { title: 'Harrow the Ninth' },
          { title: 'Nona the Ninth' },
        ],
      };
      const response = responseWithData({ data });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Published (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Published Rare Books');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with response: { status: failure }', () => {
      const response = responseWithStatus({ status: 'failure' });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Published (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Published Rare Books');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with response: { status: loading }', () => {
      const response = responseWithStatus({ status: 'loading' });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Published (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Published Rare Books');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with response: { status: success }', () => {
      const response = responseWithStatus({ status: 'success' });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Published (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Published Rare Books');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, scope });
        const expected = [
          'Home @ /',
          'Lending Library @ /lending-library',
          'Rare Books @ /lending-library/rare-books',
          'Published (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(4);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, scope });

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with a member action', () => {
    const member = true;
    const renderPage = ({
      action = 'publish',
      page,
      ...options
    }: {
      action?: string,
      breadcrumbs?: Breadcrumb[],
      data?: Record<string, unknown>, // @TODO: Remove this.
      contents?: JSX.Element | React.ComponentType,
      page: ResourcePageOptions,
      response?: Response,
      scope?: string,
      status?: string, // @TODO: Remove this.
    }) => render(
      <ResourcePage
        action={action}
        page={page}
        resourceName={resourceName}
        {...options}
      />
    );
    const page: ResourcePageOptions = { member };

    it('should display the breadcrumbs', () => {
      const { getAllByRole } = renderPage({ page });
      const expected = [
        'Home @ /',
        'Rare Books @ /rare-books',
        'Loading',
        'Publish (active)',
      ];

      const rendered = getAllByRole('listitem');

      expect(rendered).toHaveLength(4);
      expect(rendered.map(item => item.textContent)).toEqual(expected);
    });

    it('should display the heading', () => {
      const { getByRole } = renderPage({ page });

      const heading = getByRole('heading');

      expect(heading).toBeVisible();
      expect(heading).toHaveTextContent('Loading Rare Book');
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderPage({ page });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with action: an empty string', () => {
      const action = '';

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ action, page });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Loading (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ action, page });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Loading Rare Book');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ action, page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ action, page, response });
          const expected = [
            'Home @ /',
            'Rare Books @ /rare-books',
            'Gideon the Ninth (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should display the heading', () => {
          const { getByRole } = renderPage({ action, page, response });

          const heading = getByRole('heading');

          expect(heading).toBeVisible();
          expect(heading).toHaveTextContent('Gideon the Ninth');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ action, page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ action, page, response });
          const expected = [
            'Home @ /',
            'Rare Books @ /rare-books',
            'Rare Book (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should display the heading', () => {
          const { getByRole } = renderPage({ action, page, response });

          const heading = getByRole('heading');

          expect(heading).toBeVisible();
          expect(heading).toHaveTextContent('Rare Book');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ action, page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with breadcrumbs: value', () => {
      const breadcrumbs: Breadcrumb[] = [
        {
          label: 'Lending Library',
          url: '/lending-library',
        },
      ];

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ breadcrumbs, page });
        const expected = [
          'Lending Library @ /lending-library',
          'Rare Books @ /lending-library/rare-books',
          'Loading',
          'Publish (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(4);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ breadcrumbs, page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ breadcrumbs, page, response });
          const expected = [
            'Lending Library @ /lending-library',
            'Rare Books @ /lending-library/rare-books',
            'Gideon the Ninth @ /lending-library/rare-books/gideon-9',
            'Publish (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(4);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ breadcrumbs, page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ breadcrumbs, page, response });
          const expected = [
            'Lending Library @ /lending-library',
            'Rare Books @ /lending-library/rare-books',
            'Rare Book',
            'Publish (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(4);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ breadcrumbs, page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with contents: component', () => {
      const Contents = ({
        resourceName,
        response,
      }: {
        resourceName: string,
        response: Response,
      }): JSX.Element => {
        const data = (response.data || {}) as Record<string, { name: string }>;
        const { status } = response;
        const item = data[singularize(resourceName)];
        const message =
          `${item ? item.name.toString() : 'Not Found'} (${status})`;

        return (<span>{ message }</span>);
      };
      const page: ResourcePageOptions = { contents: Contents, member };

      it('should display the contents', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('Not Found (uninitialized)');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with afterContents: component', () => {
        const AfterContents = ({
          resourceName,
        }: {
          resourceName: string,
        }): JSX.Element => {
          return (<span>After { resourceName }</span>);
        };
        const page: ResourcePageOptions = {
          afterContents: AfterContents,
          contents: Contents,
          member,
        };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(getByText('Not Found (uninitialized)')).toBeVisible();
          expect(getByText('After rareBooks')).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with beforeContents: component', () => {
        const BeforeContents = ({
          resourceName,
        }: {
          resourceName: string,
        }): JSX.Element => {
          return (<span>Before { resourceName }</span>);
        };
        const page: ResourcePageOptions = {
          beforeContents: BeforeContents,
          contents: Contents,
          member,
        };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(getByText('Before rareBooks')).toBeVisible();
          expect(getByText('Not Found (uninitialized)')).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the contents', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Gideon the Ninth (success)');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the contents', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Not Found (success)');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with contents: element', () => {
      const contents = (<span>Custom Contents</span>);
      const page: ResourcePageOptions = { contents, member };

      it('should display the contents', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('Custom Contents');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const page: ResourcePageOptions = { contents };
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with afterContents: element', () => {
        const afterContents = (<span>After Contents</span>);
        const page: ResourcePageOptions = { afterContents, contents, member };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(getByText('After Contents')).toBeVisible();
          expect(getByText('Custom Contents')).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with beforeContents: element', () => {
        const beforeContents = (<span>Before Contents</span>);
        const page: ResourcePageOptions = { beforeContents, contents, member };

        it('should display the contents', () => {
          const { getByText } = renderPage({ page });

          expect(getByText('Before Contents')).toBeVisible();
          expect(getByText('Custom Contents')).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the contents', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Custom Contents');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const page: ResourcePageOptions = { contents };
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the contents', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Custom Contents');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const page: ResourcePageOptions = { contents };
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { breadcrumbs: element }', () => {
      const breadcrumbs = (<span>Custom Breadcrumbs</span>);
      const page: ResourcePageOptions = { breadcrumbs, member };

      it('should display the custom breadcrumbs', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('Custom Breadcrumbs');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the custom breadcrumbs', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Custom Breadcrumbs');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the custom breadcrumbs', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Custom Breadcrumbs');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { breadcrumbs: value }', () => {
      const breadcrumbs: Breadcrumb[] = [
        {
          label: 'Publish Rare Book',
          active: true,
        },
      ];
      const page: ResourcePageOptions = { breadcrumbs, member };

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page });
        const expected = [
          'Home @ /',
          'Publish Rare Book (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(2);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ page, response });
          const expected = [
            'Home @ /',
            'Publish Rare Book (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(2);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ page, response });
          const expected = [
            'Home @ /',
            'Publish Rare Book (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(2);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { buttons: value }', () => {
      const buttons: Button[] = [
        {
          label: 'Rock',
          type: 'primary',
        },
        {
          label: 'Paper',
          type: 'success',
        },
        {
          label: 'Scissors',
          type: 'danger',
        },
      ];
      const page: ResourcePageOptions = { buttons, member };

      it('should display the buttons', () => {
        const { getAllByRole } = renderPage({ page });
        const expected = ['Rock', 'Paper', 'Scissors'];

        const rendered = getAllByRole('button');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(button => button.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the buttons', () => {
          const { getAllByRole } = renderPage({ page, response });
          const expected = ['Rock', 'Paper', 'Scissors'];

          const rendered = getAllByRole('button');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(button => button.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the buttons', () => {
          const { getAllByRole } = renderPage({ page, response });
          const expected = ['Rock', 'Paper', 'Scissors'];

          const rendered = getAllByRole('button');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(button => button.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { heading: value }', () => {
      const page: ResourcePageOptions = {
        heading: 'Rare Publications',
        member,
      };

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Rare Publications');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the heading', () => {
          const { getByRole } = renderPage({ page, response });

          const heading = getByRole('heading');

          expect(heading).toBeVisible();
          expect(heading).toHaveTextContent('Rare Publications');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the heading', () => {
          const { getByRole } = renderPage({ page, response });

          const heading = getByRole('heading');

          expect(heading).toBeVisible();
          expect(heading).toHaveTextContent('Rare Publications');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { navigation: element }', () => {
      const navigation = (<span>Custom Navigation</span>);
      const page: ResourcePageOptions = { member, navigation };

      it('should display the custom navigation', () => {
        const { getByText } = renderPage({ page });

        const rendered = getByText('Custom Navigation');

        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the custom navigation', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Custom Navigation');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the custom navigation', () => {
          const { getByText } = renderPage({ page, response });

          const rendered = getByText('Custom Navigation');

          expect(rendered).toBeVisible();
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { navigation: value }', () => {
      const navigation = [
        {
          label: 'Nav Item',
          url: '/nav-item',
        },
        {
          label: 'Dropdown',
          items: [
            {
              label: 'Dropdown Item',
              url: '/dropdown-item',
            },
          ],
        },
      ];
      const page = { member, navigation };

      it('should display the navigation', () => {
        const { getAllByRole } = renderPage({ page });
        const expected = [
          'Nav Item @ /nav-item',
          'Dropdown Item @ /dropdown-item',
        ];

        const rendered = getAllByRole('listitem', { name: 'navigation-item' });

        expect(rendered).toHaveLength(2);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the navigation', () => {
          const { getAllByRole } = renderPage({ page, response });
          const expected = [
            'Nav Item @ /nav-item',
            'Dropdown Item @ /dropdown-item',
          ];

          const rendered = getAllByRole('listitem', { name: 'navigation-item' });

          expect(rendered).toHaveLength(2);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the navigation', () => {
          const { getAllByRole } = renderPage({ page, response });
          const expected = [
            'Nav Item @ /nav-item',
            'Dropdown Item @ /dropdown-item',
          ];

          const rendered = getAllByRole('listitem', { name: 'navigation-item' });

          expect(rendered).toHaveLength(2);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with page: { title: value }', () => {
      const title = 'Rare Books';
      const page = { member, title };

      it('should display the title', () => {
        const { getByLabelText } = renderPage({ page });

        const rendered = getByLabelText('title');

        expect(rendered).toBeVisible();
        expect(rendered).toHaveTextContent('Rare Books');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the title', () => {
          const { getByLabelText } = renderPage({ page, response });

          const rendered = getByLabelText('title');

          expect(rendered).toBeVisible();
          expect(rendered).toHaveTextContent('Rare Books');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the title', () => {
          const { getByLabelText } = renderPage({ page, response });

          const rendered = getByLabelText('title');

          expect(rendered).toBeVisible();
          expect(rendered).toHaveTextContent('Rare Books');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with page: { subtitle: value }', () => {
        const subtitle = 'the Publishing';
        const page = { member, subtitle, title };

        it('should display the title and subtitle', () => {
          const { getByLabelText } = renderPage({ page });

          const rendered = getByLabelText('title');

          expect(rendered).toBeVisible();
          expect(rendered).toHaveTextContent('Rare Books: the Publishing');
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page });

          expect(asFragment()).toMatchSnapshot();
        });

        describe('with response: { data: value }', () => {
          const data = {
            rareBook: {
              name: 'Gideon the Ninth',
              slug: 'gideon-9',
            },
          };
          const response = responseWithData({ data });

          it('should display the title and subtitle', () => {
            const { getByLabelText } = renderPage({ page, response });

            const rendered = getByLabelText('title');

            expect(rendered).toBeVisible();
            expect(rendered).toHaveTextContent('Rare Books: the Publishing');
          });

          it('should match the snapshot', () => {
            const { asFragment } = renderPage({ page, response });

            expect(asFragment()).toMatchSnapshot();
          });
        });

        describe('with response: { status: success }', () => {
          const response = responseWithStatus({ status: 'success' });

          it('should display the title and subtitle', () => {
            const { getByLabelText } = renderPage({ page, response });

            const rendered = getByLabelText('title');

            expect(rendered).toBeVisible();
            expect(rendered).toHaveTextContent('Rare Books: the Publishing');
          });

          it('should match the snapshot', () => {
            const { asFragment } = renderPage({ page, response });

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with response: { data: value }', () => {
      const data = {
        rareBook: {
          name: 'Gideon the Ninth',
          slug: 'gideon-9',
        },
      };
      const response = responseWithData({ data });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Gideon the Ninth @ /rare-books/gideon-9',
          'Publish (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(4);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Gideon the Ninth');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with response: { status: failure }', () => {
      const response = responseWithStatus({ status: 'failure' });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Loading',
          'Publish (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(4);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Loading Rare Book');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with response: { status: loading }', () => {
      const response = responseWithStatus({ status: 'loading' });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Loading',
          'Publish (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(4);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Loading Rare Book');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with response: { status: success }', () => {
      const response = responseWithStatus({ status: 'success' });

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, response });
        const expected = [
          'Home @ /',
          'Rare Books @ /rare-books',
          'Rare Book',
          'Publish (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(4);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should display the heading', () => {
        const { getByRole } = renderPage({ page, response });

        const heading = getByRole('heading');

        expect(heading).toBeVisible();
        expect(heading).toHaveTextContent('Rare Book');
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, response });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with scope: value', () => {
      const scope = 'lendingLibrary';

      it('should display the breadcrumbs', () => {
        const { getAllByRole } = renderPage({ page, scope });
        const expected = [
          'Home @ /',
          'Lending Library @ /lending-library',
          'Rare Books @ /lending-library/rare-books',
          'Loading',
          'Publish (active)',
        ];

        const rendered = getAllByRole('listitem');

        expect(rendered).toHaveLength(5);
        expect(rendered.map(item => item.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderPage({ page, scope });

        expect(asFragment()).toMatchSnapshot();
      });

      describe('with response: { data: value }', () => {
        const data = {
          rareBook: {
            name: 'Gideon the Ninth',
            slug: 'gideon-9',
          },
        };
        const response = responseWithData({ data });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ page, response, scope });
          const expected = [
            'Home @ /',
            'Lending Library @ /lending-library',
            'Rare Books @ /lending-library/rare-books',
            'Gideon the Ninth @ /lending-library/rare-books/gideon-9',
            'Publish (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(5);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response, scope });

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('with response: { status: success }', () => {
        const response = responseWithStatus({ status: 'success' });

        it('should display the breadcrumbs', () => {
          const { getAllByRole } = renderPage({ page, response, scope });
          const expected = [
            'Home @ /',
            'Lending Library @ /lending-library',
            'Rare Books @ /lending-library/rare-books',
            'Rare Book',
            'Publish (active)',
          ];

          const rendered = getAllByRole('listitem');

          expect(rendered).toHaveLength(5);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } = renderPage({ page, response, scope });

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });
  });
});
