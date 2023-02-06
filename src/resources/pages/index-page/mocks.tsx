import * as React from 'react';

import type { DataTableData } from '@components/data-table';
import type { DataTableType } from '@resources/components/table';

export const MockTable = ({ data }: { data: DataTableData }): JSX.Element => {
  const books = 'rareBooks' in data ? data.rareBooks : [];

  return (
    <span className="mock-data-table">
      { `There are ${books.length} books!` }
    </span>
  );
};

export const ResourceIndexPageContents = ({
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
};
