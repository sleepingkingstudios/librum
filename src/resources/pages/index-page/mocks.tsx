import * as React from 'react';

import { responseWithData } from '@api';
import type { DataTableData } from '@components/data-table';
import { ResourcePage } from '@resources/components/page';
import type { ResourcePageProps } from '@resources/components/page';

export const MockTable = ({ data }: { data: DataTableData }): JSX.Element => {
  const books = 'rareBooks' in data ? data.rareBooks : [];

  return (
    <span className="mock-data-table">
      { `There are ${books.length} books!` }
    </span>
  );
};

export const ResourceIndexPage = ({
  Table,
  page,
  resourceName,
}: ResourcePageProps): JSX.Element => {
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
  const response = responseWithData({ data });
  const contents = (
    <div>
      <h1>Content for {resourceName}</h1>

      <Table data={data} name={resourceName} />
    </div>
  );
  const pageWithDefaults = {
    ...page,
    contents,
  };

  return (
    <ResourcePage
      action={''}
      page={pageWithDefaults}
      resourceName={resourceName}
      response={response}
    />
  );
};
