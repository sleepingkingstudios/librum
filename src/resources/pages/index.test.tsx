import * as React from 'react';

import '@testing-library/jest-dom';

import { generateResourcePages } from './index';
import type { ResourceApiHooks } from '@resources/api/types';
import type { ResourcePageOptions } from '@resources/components/page';
import { render } from '@test-helpers/rendering';
import { isElement } from '@utils/react-utils';
import { MockTable as Table } from './index-page/mocks';
import type {
  ResourcePagesConfiguration,
  ResourceProps,
} from '../types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock(
  '@resources/pages/index-page/contents',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => require('@resources/pages/index-page/mocks'),
);

describe('Resource generateResourcePages()', () => {
  const apiHooks: ResourceApiHooks = {};
  const resourceName = 'rareBooks';

  const shouldConfigureThePage = ({
    Page,
    options,
    page,
  }: {
    Page: React.ComponentType,
    options: ResourceProps,
    page: ResourcePageOptions,
  }): void => {
    const renderPage = () => render(
      <Page />,
      { router: true },
    );

    if ('navigation' in options || 'navigation' in page) {
      const expectedNavigation = page.navigation || options.navigation;

      if (isElement(expectedNavigation)) {
        it('should display the custom navigation', () => {
          const { getByText } = renderPage();

          const rendered = getByText('Custom Navigation');

          expect(rendered).toBeVisible();
        });
      } else {
        it('should display the navigation', () => {
          const { getAllByRole } = renderPage();
          const expected = [
            'Nav Item @ /nav-item',
            'Dropdown Item @ /dropdown-item',
          ];

          const rendered = getAllByRole('listitem', { name: 'navigation-item' });

          expect(rendered).toHaveLength(2);
          expect(rendered.map(item => item.textContent)).toEqual(expected);
        });
      }
    }

    if ('title' in options || 'title' in page) {
      const expectedTitle = page.title || options.title;
      const expectedSubtitle = page.subtitle || options.subtitle;
      const expectedText = expectedSubtitle
        ? `${expectedTitle}: ${expectedSubtitle}`
        : expectedTitle;

      it('should display the title', () => {
        const { getByLabelText } = renderPage();

        const rendered = getByLabelText('title');

        expect(rendered).toBeVisible();
        expect(rendered).toHaveTextContent(expectedText);
      });
    }
  };

  const shouldGenerateTheIndexPage = ({
    IndexPage,
    options,
  }: {
    IndexPage: React.ComponentType,
    options: ResourceProps,
  }): void => {
    const page = ((options.pages || {})['index'] || {}) as ResourcePageOptions;
    const renderIndexPage = () => render(
      <IndexPage />,
      { router: true },
    );

    it('should render the contents', () => {
      const { getByText } = renderIndexPage();

      const table = getByText('There are 3 books!');

      expect(table).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderIndexPage();

      expect(asFragment()).toMatchSnapshot();
    });

    shouldConfigureThePage({ Page: IndexPage, options, page });
  };

  const shouldGenerateTheStandardPages = ({
    extraPages = [],
    index = true,
    options,
  }: {
    extraPages?: string[],
    index?: 'skip' | boolean,
    options: ResourceProps,
  }): void => {
    const generated = generateResourcePages({
      Table,
      apiHooks,
      resourceName,
      ...options,
    });

    it('should generate the resource pages', () => {
      const expected = [...extraPages];

      if (index) { expected.push('IndexPage'); }

      expect(Object.keys(generated)).toHaveLength(expected.length);

      expected.forEach((key: string): void => {
        expect(key in generated).toBe(true);
      });
    });

    if (index && !(index === 'skip')) {
      const { IndexPage } = generated;

      shouldGenerateTheIndexPage({ IndexPage, options });
    }
  };
  const pages: ResourcePagesConfiguration = {};
  const options: ResourceProps = {
    pages,
    resourceName,
  };

  it('should be a function', () => {
    expect(typeof generateResourcePages).toBe('function');
  });

  shouldGenerateTheStandardPages({ options });

  describe('with navigation: element', () => {
    const navigation = (<span>Custom Navigation</span>);
    const options = { navigation, pages, resourceName };

    shouldGenerateTheStandardPages({ options });
  });

  describe('with navigation: value', () => {
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
    const options = { navigation, pages, resourceName };

    shouldGenerateTheStandardPages({ options });
  });

  describe('with pages: { index: Page }', () => {
    const CustomPage = ({ resourceName }: { resourceName: string }) => (
      <span>Custom Page for { resourceName }</span>
    );
    const pages = { index: { Page: CustomPage } };
    const options = { pages, resourceName };
    const generated = generateResourcePages({
      Table,
      apiHooks,
      resourceName,
      ...options,
    });
    const { IndexPage } = generated;

    shouldGenerateTheStandardPages({ index: 'skip', options });

    it('should render the page', () => {
      const { getByText } = render(<IndexPage />);

      expect(getByText('Custom Page for rareBooks')).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<IndexPage />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with pages: { index: false }', () => {
    const pages: ResourcePagesConfiguration = { index: false };
    const options = { pages, resourceName };

    shouldGenerateTheStandardPages({ index: false, options });
  });

  describe('with pages: { index: value }', () => {
    const index = { title: 'Rare Tomes' };
    const pages = { index };
    const options = { pages, resourceName };

    shouldGenerateTheStandardPages({ options });
  });

  describe('with title: value', () => {
    const title = 'Rare Books';
    const options = { pages, resourceName, title };

    shouldGenerateTheStandardPages({ options });

    describe('with pages: { index: value }', () => {
      const index = { title: 'Rare Tomes' };
      const pages = { index };
      const options = { pages, resourceName, title };

      shouldGenerateTheStandardPages({ options });
    });

    describe('with subtitle: value', () => {
      const subtitle = 'the Publishing';
      const options = { pages, resourceName, subtitle, title };

      shouldGenerateTheStandardPages({ options });
    });
  });

  describe('with extra pages: Pages', () => {
    const CustomPage = ({ resourceName }: { resourceName: string }) => (
      <span>Custom Page for { resourceName }</span>
    );
    const published: ResourcePageOptions = {};
    const pages: ResourcePagesConfiguration = {
      published: { Page: CustomPage },
    };
    const options = { pages, resourceName };
    const generated = generateResourcePages({
      Table,
      apiHooks,
      resourceName,
      ...options,
    });
    const { PublishedPage } = generated;
    const renderPublishedPage = () => render(
      <PublishedPage />,
      { router: true },
    );

    shouldGenerateTheStandardPages({ extraPages: ['PublishedPage'], options });

    shouldConfigureThePage({ Page: PublishedPage, options, page: published });

    it('should render the contents', () => {
      const { getByText } = renderPublishedPage();

      expect(getByText('Custom Page for rareBooks')).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderPublishedPage();

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with extra pages: values', () => {
    const Contents =
      ({ resourceName }: { resourceName: string }): JSX.Element => (
        <span>Contents for { resourceName }</span>
      );
    const published: ResourcePageOptions = {
      contents: Contents,
      member: false,
    };
    const pages: ResourcePagesConfiguration = { published };
    const options = { pages, resourceName };
    const generated = generateResourcePages({
      Table,
      apiHooks,
      resourceName,
      ...options,
    });
    const { PublishedPage } = generated;
    const renderPublishedPage = () => render(
      <PublishedPage />,
      { router: true },
    );

    shouldGenerateTheStandardPages({ extraPages: ['PublishedPage'], options });

    shouldConfigureThePage({ Page: PublishedPage, options, page: published });

    it('should render the contents', () => {
      const { getByText } = renderPublishedPage();

      const contents = getByText('Contents for rareBooks');

      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderPublishedPage();

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
