import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourcesTable } from './index';

import {
  responseWithData,
  responseWithStatus,
} from '@api';
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
  const response = responseWithStatus({ status: 'uninitialized' });
  const expectedHeaders = ['Name', 'Role'];

  it('should display the table headings', () => {
    const { getAllByRole } = render(
      <ResourcesTable
        Table={EmployeesTable}
        resourceName={resourceName}
        response={response}
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
        response={response}
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
        response={response}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the request is loading', () => {
    const loadingResponse = responseWithStatus({ status: 'loading' });

    it('should display the loading message', () => {
      const { getByText } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          response={loadingResponse}
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
          response={loadingResponse}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request is failing', () => {
    const failureResponse = responseWithStatus({ status: 'failure' });

    it('should display the table headings', () => {
      const { getAllByRole } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          response={failureResponse}
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
          response={failureResponse}
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
          response={failureResponse}
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
    const successResponse = responseWithData({
      data: { currentEmployees },
    });
    const expectedBody = [
      'Alan Bradley',
      'user',
      'Ed Dillinger',
      'admin',
      'Kevin Flynn',
      'user',
    ];

    it('should display the table headings', () => {
      const { getAllByRole } = render(
        <ResourcesTable
          Table={EmployeesTable}
          resourceName={resourceName}
          response={successResponse}
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
          response={successResponse}
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
          response={successResponse}
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
      const loadingResponse = responseWithStatus({ status: 'loading' });

      it('should display the loading message', () => {
        const { getByText } = render(
          <ResourcesTable
            Table={EmployeesTable}
            loader={<CustomLoader />}
            resourceName={resourceName}
            response={loadingResponse}
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
            response={loadingResponse}
          />
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
