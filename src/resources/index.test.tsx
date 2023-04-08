import * as React from 'react';

import '@testing-library/jest-dom';
import { Routes } from 'react-router-dom';

import { generateResource } from './index';
import type { UseQuery } from '@api';
import { responseWithData } from '@api/request';
import { successResult } from '@api/test-helpers';
import type { DataTableData } from '@components/data-table';
import { render } from '@test-helpers/rendering';
import {
  generateResourcesApi,
  useResourceQuery,
} from './api';
import type { ResourceProps } from './types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('./api', () => require('./api/mocks'));

const mockUseResourceQuery =
  useResourceQuery as jest.MockedFunction<typeof useResourceQuery>;

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
    const refetch = jest.fn();
    const response = responseWithData({ data: indexData });

    beforeEach(() => {
      mockUseResourceQuery.mockImplementation(() => [response, refetch]);
    });

    it('should generate the index route', () => {
      const { apiHooks, routes } = generateResource(resource);
      const useIndexResources =
        apiHooks.useIndexResources as jest.MockedFunction<UseQuery>;
      const result = {
        ...successResult,
        data: {
          ok: true,
          data: indexData,
        },
      };

      useIndexResources.mockImplementation(() => result);

      const { asFragment, getByText } = render(
        <Routes>{ routes() }</Routes>,
        {
          initialEntries: [at],
          router: true,
          store: true,
        },
      );

      expect(getByText('There are 3 books!')).toBeVisible();

      expect(asFragment()).toMatchSnapshot();
    });
  };

  const resourceName = 'rareBooks';
  const resource: ResourceProps = { Table, resourceName };
  const indexData: DataTableData = {
    rareBooks: [
      {
        title: 'On War',
      },
      {
        title: 'The Art of War',
      },
      {
        title: 'The Prince',
      },
    ],
  };

  it('should be a function', () => {
    expect(typeof generateResource).toBe('function');
  });

  it('should generate the API hooks', () => {
    generateResource(resource);

    expect(generateResourcesApi).toHaveBeenCalledWith(resource);
  });

  it('should generate the resource Pages', () => {
    const { Pages } = generateResource(resource);
    const expected = ['IndexPage'];

    expect(Object.keys(Pages)).toEqual(expected);
  });

  shouldGenerateTheIndexRoute({ resource });

  describe('with scope: value', () => {
    const scope = 'lendingLibrary';
    const resource: ResourceProps = { Table, resourceName, scope };

    shouldGenerateTheIndexRoute({
      resource,
      at: '/lending-library/rare-books',
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
      Table,
      endpoints,
      pages,
      resourceName,
    };

    it('should generate the API hooks', () => {
      generateResource(resource);

      expect(generateResourcesApi).toHaveBeenCalledWith(resource);
    });

    it('should generate the resource Pages', () => {
      const { Pages } = generateResource(resource);
      const expected = ['IndexPage', 'PublishPage', 'PublishedPage'];

      expect(Object.keys(Pages)).toEqual(expected);
    });

    shouldGenerateTheIndexRoute({ resource });

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
