import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourcesTable } from './index';
import {
  defaultResponse,
  failureResponse,
  loadingResponse,
  successResponse,
} from '@api/test-helpers';
import { DataTable } from '@components/data-table';
import type {
  DataTableColumn,
  DataTableData,
} from '@components/data-table/types';
import { render } from '@test-helpers/rendering';

const columns: DataTableColumn[] = [
  { name: 'name' },
  { name: 'role' },
];
const EmployeesTable = ({ data }: { data: DataTableData }): JSX.Element => (
  <DataTable columns={columns} data={data} name="currentEmployees" />
);

describe('<ResourcesTable />', () => {
  const resourceName = 'currentEmployees';
  const useRequest = jest.fn(() => defaultResponse);
  const expectedHeaders = ['Name', 'Role'];

  beforeEach(() => { useRequest.mockClear(); });

  it('should perform the request', () => {
    render(
      <ResourcesTable
        Table={EmployeesTable}
        resourceName={resourceName}
        useRequest={useRequest}
      />
    );

    expect(useRequest).toHaveBeenCalled();
  });

  describe('when the request is loading', () => {
    beforeEach(() => {
      useRequest.mockImplementation(() => loadingResponse);
    });

    it('should display the loading message', () => {
      const { getByText } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );
      const loader = getByText('Loading Current Employees...');

      expect(loader).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request is failing', () => {
    beforeEach(() => {
      useRequest.mockImplementation(() => failureResponse);
    });

    it('should display the table headings', () => {
      const { getAllByRole } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );
      const headers = getAllByRole('columnheader');

      expect(headers).toHaveLength(2);
      expect(headers.map(header => header.textContent))
        .toEqual(expectedHeaders);
    });

    it('should display the empty message', () => {
      const { getByRole } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );
      const cell = getByRole('cell');

      expect(cell).toBeVisible();
      expect(cell.textContent).toBe('There are no matching current employees.');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request is successful', () => {
    const currentEmployees = [
      {
        name: 'Alan Bradley',
        role: 'user',
      },
      {
        name: 'Ed Dillinger',
        role: 'admin',
      },
      {
        name: 'Kevin Flynn',
        role: 'user',
      },
    ];
    const responseWithData = {
      ...successResponse,
      data: { currentEmployees },
      hasData: true,
    };
    const expectedBody = [
      'Alan Bradley',
      'user',
      'Ed Dillinger',
      'admin',
      'Kevin Flynn',
      'user',
    ];

    beforeEach(() => {
      useRequest.mockImplementation(() => responseWithData);
    });

    it('should display the table headings', () => {
      const { getAllByRole } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );
      const headers = getAllByRole('columnheader');

      expect(headers).toHaveLength(2);
      expect(headers.map(header => header.textContent))
        .toEqual(expectedHeaders);
    });

    it('should display the table contents', () => {
      const { getAllByRole } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );
      const cells = getAllByRole('cell');

      expect(cells).toHaveLength(6);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedBody);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          useRequest={useRequest}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with loader: component', () => {
    const CustomLoader = (): JSX.Element => (
      <span className="custom-loader">Loading, loading, loading...</span>
    );

    describe('when the request is loading', () => {
      beforeEach(() => {
        useRequest.mockImplementation(() => loadingResponse);
      });

      it('should display the loading message', () => {
        const { getByText } = render(
          <ResourcesTable
            Table={EmployeesTable}
            loader={<CustomLoader />}
            resourceName={resourceName}
            useRequest={useRequest}
          />
        );
        const loader = getByText('Loading, loading, loading...');

        expect(loader).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcesTable
            Table={EmployeesTable}
            loader={<CustomLoader />}
            resourceName={resourceName}
            useRequest={useRequest}
          />
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
