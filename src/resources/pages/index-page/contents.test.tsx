import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceIndexPageContents } from './contents';
import type { DisplayAlertProps } from '@alerts';
import { useApiQuery } from '@api/request';
import type { AlertDirective } from '@api/request';
import {
  withData as responseWithData,
  withStatus as responseWithStatus,
} from '@api/request/utils';
import type { DataTableData } from '@components/data-table';
import type { ResourcePageOptions } from '@resources/components/page';
import { render } from '@test-helpers/rendering';

jest.mock('@api/request');

const mockUseApiQuery =
  useApiQuery as jest.MockedFunction<typeof useApiQuery>;

const MockTable = ({ data }: { data: DataTableData }): JSX.Element => {
  const books = 'rareBooks' in data ? data.rareBooks : [];

  return (
    <span className="mock-data-table">
      { `There are ${books.length} books!` }
    </span>
  );
};

describe('<ResourceIndexPageContents />', () => {
  const action = 'index';
  const member = false;
  const resourceName = 'rareBooks';
  const useIndexResources = jest.fn();
  const apiHooks = { useIndexResources };
  const renderContents = ({ page }: { page: ResourcePageOptions }) => render(
    <ResourceIndexPageContents
      Table={MockTable}
      action={action}
      apiHooks={apiHooks}
      page={page}
      resourceName={resourceName}
    />,
    { store: true },
  );
  const page: ResourcePageOptions = { member };
  const url = 'api/rare_books';
  const failureAlert: DisplayAlertProps = {
    context: 'resources:rareBooks:request',
    message: 'Unable to find rare books',
    type: 'failure',
  };
  const alerts: AlertDirective[] = [
    {
      display: failureAlert,
      status: 'errored',
    },
    {
      display: failureAlert,
      status: 'failure',
    },
    {
      dismiss: failureAlert.context,
      status: 'success',
    },
  ];
  const refetch = jest.fn();
  const response = responseWithStatus({ status: 'uninitialized' });

  beforeEach(() => {
    mockUseApiQuery
      .mockClear()
      .mockImplementation(() => [response, refetch])
  });

  it('should configure the request', () => {
    renderContents({ page });
    const expected = {
      alerts,
      url,
    };

    expect(mockUseApiQuery).toHaveBeenCalledWith(expected);
  });

  it('should display the empty table', () => {
    const { getByText } = renderContents({ page });

    const table = getByText('There are 0 books!');

    expect(table).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = renderContents({ page });

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the response is loading', () => {
    const loadingResponse = responseWithStatus({ status: 'loading' });

    beforeEach(() => {
      mockUseApiQuery.mockImplementation(() => [loadingResponse, refetch]);
    });

    it('should display the loading message', () => {
      const { getByText } = renderContents({ page });

      const message = getByText('Loading Rare Books...');

      expect(message).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderContents({ page });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the response is failing', () => {
    const failureResponse = responseWithStatus({ status: 'failure' });

    beforeEach(() => {
      mockUseApiQuery.mockImplementation(() => [failureResponse, refetch]);
    });

    it('should display the empty table', () => {
      const { getByText } = renderContents({ page });

      const table = getByText('There are 0 books!');

      expect(table).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderContents({ page });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the response is passing', () => {
    const data = {
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
    const successResponse = responseWithData({ data });

    beforeEach(() => {
      mockUseApiQuery.mockImplementation(() => [successResponse, refetch]);
    });

    it('should display the table', () => {
      const { getByText } = renderContents({ page });

      const table = getByText('There are 3 books!');

      expect(table).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderContents({ page });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with Table: undefined', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPageContents
          action={action}
          apiHooks={apiHooks}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
