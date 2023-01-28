import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceIndexPage } from './index';
import type { DataTableData } from '@components/data-table';
import type { ResourcePageOptions } from '@resources/components/page';
import type { DataTableType } from '@resources/components/table';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock('./contents', () => ({
  ResourceIndexPageContents: ({
    Table,
    resourceName,
  }: {
    Table: DataTableType,
    resourceName: string,
  }): JSX.Element => {
    const data: DataTableData = {
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

    return (
      <div>
        <h1>Content for { resourceName }</h1>

        <Table data={data} name={resourceName} />
      </div>
    );
  },
}));

const MockTable = ({ data }: { data: DataTableData }): JSX.Element => {
  const books = 'rareBooks' in data ? data.rareBooks : [];

  return (
    <span className="mock-data-table">
      { `There are ${books.length} books!` }
    </span>
  );
};

describe('<ResourceIndexPage />', () => {
  const action = 'index';
  const member = false;
  const page: ResourcePageOptions = {};
  const resourceName = 'rareBooks';
  const useIndexResources = jest.fn();
  const apiHooks = { useIndexResources };

  const renderIndexPage = () => render(
    <ResourceIndexPage
      Table={MockTable}
      action={action}
      apiHooks={apiHooks}
      member={member}
      page={page}
      resourceName={resourceName}
    />,
    {
      router: true,
      store: true,
    },
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
});
