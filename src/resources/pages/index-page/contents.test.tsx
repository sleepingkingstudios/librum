import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceIndexPageContents } from './contents';
import type {
  Effect,
  Response,
} from '@api';
import type { AlertDirective } from '@api/effects/display-alerts';
import {
  failureResponse,
  loadingResponse,
  successResponse,
} from '@api/test-helpers';
import type { DataTableData } from '@components/data-table';
import { render } from '@test-helpers/rendering';
import { useResourceQuery as mockUseResourceQuery } from '@resources/api/hooks/mocks';
import type { ResourcePageOptions } from '@resources/components/page';

jest.mock('@resources/api/hooks', () => require('@resources/api/hooks/mocks'));

const useRequest = mockUseResourceQuery() as jest.MockedFunction<() => Response>;

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
  const page: ResourcePageOptions = {};
  const resourceName = 'rareBooks';
  const useIndexResources = jest.fn();
  const apiHooks = { useIndexResources };

  beforeEach(() => {
    mockUseResourceQuery.mockClear();

    useRequest.mockClear();
  });

  it('should configure the request', () => {
    render(
      <ResourceIndexPageContents
        Table={MockTable}
        action={action}
        apiHooks={apiHooks}
        member={member}
        page={page}
        resourceName={resourceName}
      />,
      { store: true },
    );
    const expected = {
      action,
      member,
      resourceName,
      useQuery: useIndexResources,
    };

    expect(mockUseResourceQuery).toHaveBeenCalledWith(expected);
  });

  it('should perform the query', () => {
    render(
      <ResourceIndexPageContents
        Table={MockTable}
        action={action}
        apiHooks={apiHooks}
        member={member}
        page={page}
        resourceName={resourceName}
      />,
      { store: true },
    );

    expect(useRequest).toHaveBeenCalled();
  });

  it('should display the empty table', () => {
    const { getByText } = render(
      <ResourceIndexPageContents
        Table={MockTable}
        action={action}
        apiHooks={apiHooks}
        member={member}
        page={page}
        resourceName={resourceName}
      />,
      { store: true },
    );

    const table = getByText('There are 0 books!');

    expect(table).toBeVisible();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <ResourceIndexPageContents
        Table={MockTable}
        action={action}
        apiHooks={apiHooks}
        member={member}
        page={page}
        resourceName={resourceName}
      />,
      { store: true },
    );

    expect(asFragment).toMatchSnapshot();
  });

  describe('when the response is loading', () => {
    beforeEach(() => {
      useRequest.mockImplementation(() => loadingResponse);
    });

    it('should display the loading message', () => {
      const { getByText } = render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );

      const message = getByText('Loading Rare Books...');

      expect(message).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );

      expect(asFragment).toMatchSnapshot();
    });
  });

  describe('when the response is failing', () => {
    beforeEach(() => {
      useRequest.mockImplementation(() => failureResponse);
    });

    it('should display the empty table', () => {
      const { getByText } = render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );

      const table = getByText('There are 0 books!');

      expect(table).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );

      expect(asFragment).toMatchSnapshot();
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
    const response = {
      ...successResponse,
      data,
      hasData: true,
    };

    beforeEach(() => {
      useRequest.mockImplementation(() => response);
    });

    it('should display the table', () => {
      const { getByText } = render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );

      const table = getByText('There are 3 books!');

      expect(table).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );

      expect(asFragment).toMatchSnapshot();
    });
  });

  describe('with page: { alerts: value }', () => {
    const alerts: AlertDirective[] = [
      {
        display: { message: 'Something went wrong' },
        status: 'failure',
      },
      {
        display: { message: 'All is well' },
        status: 'success',
      },
    ];
    const page: ResourcePageOptions = { alerts };

    it('should configure the request', () => {
      render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );
      const expected = {
        action,
        alerts,
        member,
        resourceName,
        useQuery: useIndexResources,
      };

      expect(mockUseResourceQuery).toHaveBeenCalledWith(expected);
    });
  });

  describe('with effects: value', () => {
    const effects: Effect[] = [
      jest.fn(),
      jest.fn(),
    ];
    const page: ResourcePageOptions = { effects };

    it('should configure the request', () => {
      render(
        <ResourceIndexPageContents
          Table={MockTable}
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
        { store: true },
      );
      const expected = {
        action,
        effects,
        member,
        resourceName,
        useQuery: useIndexResources,
      };

      expect(mockUseResourceQuery).toHaveBeenCalledWith(expected);
    });
  });
});
