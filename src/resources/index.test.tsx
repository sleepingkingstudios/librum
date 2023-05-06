import * as React from 'react';

import '@testing-library/jest-dom';
import { Routes } from 'react-router-dom';

import { generateResource } from './index';
import { responseWithData } from '@api';
import type { DataTableData } from '@components/data-table';
import { render } from '@test-helpers/rendering';
import { useResourceQuery } from './api';
import type {
  DataBlockData,
  ResourceProps,
} from './types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock('./api');

const mockUseResourceQuery =
  useResourceQuery as jest.MockedFunction<typeof useResourceQuery>;

const Block = ({ data }: { data: DataBlockData }): JSX.Element => {
  const book = 'rareBook' in data ? data.rareBook : { name: 'Unknown Book' };

  return (
    <span className="mock-data-table">
      { `Showing book "${book.name.toString()}"` }
    </span>
  );
};
const Table = ({ data }: { data: DataTableData }): JSX.Element => {
  const books = 'rareBooks' in data ? data.rareBooks : [];

  return (
    <span className="mock-data-table">
      { `There are ${books.length} books!` }
    </span>
  );
};

describe('Resources generateResource()', () => {
  const shouldGenerateTheIndexRoute = ({
    at = '/rare-books',
    resource,
  }: {
    at?: string,
    resource: ResourceProps,
  }): void => {
    describe('should generate the index route', () => {
      const indexData: DataTableData = {
        rareBooks: [
          {
            name: 'Gideon the Ninth',
          },
          {
            name: 'Harrow the Ninth',
          },
          {
            name: 'Nona the Ninth',
          },
        ],
      };
      const refetch = jest.fn();
      const response = responseWithData({ data: indexData });
      const { routes } = generateResource(resource);

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should render the content', () => {
        const { getByText } = render(
          <Routes>{ routes() }</Routes>,
          {
            initialEntries: [at],
            router: true,
            store: true,
          },
        );

        expect(getByText('There are 3 books!')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Routes>{ routes() }</Routes>,
          {
            initialEntries: [at],
            router: true,
            store: true,
          },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  };
  const shouldGenerateTheShowRoute = ({
    at = '/rare-books/gideon-9',
    resource,
  }: {
    at?: string,
    resource: ResourceProps,
  }): void => {
    describe('should generate the show route', () => {
      const showData: DataBlockData = {
        rareBook: {
          name: 'Gideon the Ninth',
          slug: 'gideon-9',
          author: 'Tammsyn Muir',
        },
      };
      const refetch = jest.fn();
      const response = responseWithData({ data: showData });
      const { routes } = generateResource(resource);

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should render the content', () => {
        const { getByText } = render(
          <Routes>{ routes() }</Routes>,
          {
            initialEntries: [at],
            router: true,
            store: true,
          },
        );

        expect(getByText('Showing book "Gideon the Ninth"')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Routes>{ routes() }</Routes>,
          {
            initialEntries: [at],
            router: true,
            store: true,
          },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  };
  const shouldGenerateTheStandardRoutes = ({
    at = '/rare-books',
    resource,
  }: {
    at?: string,
    resource: ResourceProps,
  }): void => {
    shouldGenerateTheIndexRoute({ at, resource });

    shouldGenerateTheShowRoute({ at: `${at}/gideon-9`, resource });
  };

  const resourceName = 'rareBooks';
  const resource: ResourceProps = { Block, Table, resourceName };

  it('should be a function', () => {
    expect(typeof generateResource).toBe('function');
  });

  it('should generate the resource Pages', () => {
    const { Pages } = generateResource(resource);
    const expected = ['IndexPage', 'ShowPage'];

    expect(Object.keys(Pages)).toEqual(expected);
  });

  shouldGenerateTheStandardRoutes({ resource });

  describe('with scope: value', () => {
    const scope = 'lendingLibrary';
    const resource: ResourceProps = { Block, Table, resourceName, scope };

    shouldGenerateTheStandardRoutes({
      at: '/lending-library/rare-books',
      resource,
    });
  });

  describe('with extra pages', () => {
    const endpoints = {
      publish: {
        member: true,
        method: 'PUT',
      },
      published: {
        member: false,
      },
    };
    const pages = {
      publish: {
        contents: (<span>Publish Page</span>),
        member: true,
      },
      published: {
        contents: (<span>Published Page</span>),
      },
    };
    const resource = {
      Block,
      Table,
      endpoints,
      pages,
      resourceName,
    };

    it('should generate the resource Pages', () => {
      const { Pages } = generateResource(resource);
      const expected = [
        'IndexPage',
        'ShowPage',
        'PublishPage',
        'PublishedPage',
      ];

      expect(Object.keys(Pages)).toEqual(expected);
    });

    shouldGenerateTheStandardRoutes({ resource });

    it('should generate the publish route', () => {
      const { routes } = generateResource(resource);

      const { asFragment, getByText } = render(
        <Routes>{ routes() }</Routes>,
        {
          initialEntries: ['/rare-books/on-war/publish'],
          router: true,
          store: true,
        },
      );

      expect(getByText('Publish Page')).toBeVisible();

      expect(asFragment()).toMatchSnapshot();
    });

    it('should generate the published route', () => {
      const { routes } = generateResource(resource);

      const { asFragment, getByText } = render(
        <Routes>{ routes() }</Routes>,
        {
          initialEntries: ['/rare-books/published'],
          router: true,
          store: true,
        },
      );

      expect(getByText('Published Page')).toBeVisible();

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
