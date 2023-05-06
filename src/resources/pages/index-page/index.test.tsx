import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceIndexPage } from './index';
import {
  responseWithData,
  responseWithStatus,
} from '@api';
import {
  generateAlerts,
  useResourceQuery,
} from '@resources/api';
import type { ResourcePageOptions } from '@resources/components/page';
import { ConfiguredDataTable } from '@resources/types';
import { render } from '@test-helpers/rendering';
import { MockTable as Table } from './mocks';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@resources/api', () => require('@resources/api/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock(
  '@components/page/breadcrumbs',
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => require('@components/page/breadcrumbs/mocks'),
);

const mockUseResourceQuery = useResourceQuery as jest.MockedFunction<
  typeof useResourceQuery
>;

describe('<ResourceIndexPage />', () => {
  const action = 'index';
  const page: ResourcePageOptions = { member: false };
  const resourceName = 'rareBooks';
  const renderIndexPage = ({
    Table,
  }: {
    Table?: ConfiguredDataTable,
  }) => render(
    <ResourceIndexPage
      Table={Table}
      action={action}
      page={page}
      resourceName={resourceName}
    />,
    {
      router: true,
      store: true,
    },
  );
  const refetch = jest.fn();
  const response = responseWithStatus({ status: 'uninitialized' });

  beforeEach(() => {
    mockUseResourceQuery
      .mockClear()
      .mockImplementation(() => [response, refetch]);
  });

  it('should configure the request', () => {
    const alerts = generateAlerts({
      action: 'find',
      member: false,
      query: true,
      resourceName,
    });
    const expected = {
      action,
      alerts,
      member: false,
      resourceName,
      url: '',
    };

    renderIndexPage({});

    expect(useResourceQuery).toHaveBeenCalledWith(expected);
  });

  it('should display the breadcrumbs', () => {
    const { getAllByRole } = renderIndexPage({});
    const expected = [
      'Home @ /',
      'Rare Books (active)',
    ];

    const rendered = getAllByRole('listitem');

    expect(rendered).toHaveLength(2);
    expect(rendered.map(item => item.textContent)).toEqual(expected);
  });

  it('should display the contents', () => {
    const { getByText } = renderIndexPage({});

    const contents = getByText('Missing <Table /> Component');
    expect(contents).toBeVisible();
  });

  it('should display the heading', () => {
    const { getByRole } = renderIndexPage({});

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent('Rare Books');
  });

  it('should match the snapshot', () => {
    const { asFragment } = renderIndexPage({});

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the query returns a failing response', () => {
    const response = responseWithStatus({ status: 'failure' });

    beforeEach(() => {
      mockUseResourceQuery.mockImplementation(() => [response, refetch]);
    });

    it('should display the contents', () => {
      const { getByText } = renderIndexPage({});

      const contents = getByText('Missing <Table /> Component');
      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderIndexPage({});

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the query returns a loading response', () => {
    const response = responseWithStatus({ status: 'loading' });

    beforeEach(() => {
      mockUseResourceQuery.mockImplementation(() => [response, refetch]);
    });

    it('should display the loading message', () => {
      const { getByText } = renderIndexPage({});

      const contents = getByText('Loading Rare Books...');
      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderIndexPage({});

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the query returns a successful response', () => {
    const response = responseWithStatus({ status: 'success' });

    beforeEach(() => {
      mockUseResourceQuery.mockImplementation(() => [response, refetch]);
    });

    it('should display the contents', () => {
      const { getByText } = renderIndexPage({});

      const contents = getByText('Missing <Table /> Component');
      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderIndexPage({});

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with Table: value', () => {
    it('should display the contents', () => {
      const { getByText } = renderIndexPage({ Table });

      const contents = getByText('There are 0 books!');
      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderIndexPage({ Table });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the query returns a failing response', () => {
      const response = responseWithStatus({ status: 'failure' });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the contents', () => {
        const { getByText } = renderIndexPage({ Table });

        const contents = getByText('There are 0 books!');
        expect(contents).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderIndexPage({ Table });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the query returns a loading response', () => {
      const response = responseWithStatus({ status: 'loading' });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the loading message', () => {
        const { getByText } = renderIndexPage({});

        const contents = getByText('Loading Rare Books...');
        expect(contents).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderIndexPage({ Table });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the query returns a successful response', () => {
      const response = responseWithStatus({ status: 'success' });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the contents', () => {
        const { getByText } = renderIndexPage({ Table });

        const contents = getByText('There are 0 books!');
        expect(contents).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderIndexPage({ Table });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the query returns a successful response with data', () => {
      const data = {
        rareBooks: [
          { title: 'Gideon the Ninth' },
          { title: 'Harrow the Ninth' },
          { title: 'Nona the Ninth' },
        ],
      };
      const response = responseWithData({ data });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the contents', () => {
        const { getByText } = renderIndexPage({ Table });

        const contents = getByText('There are 3 books!');
        expect(contents).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderIndexPage({ Table });

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
