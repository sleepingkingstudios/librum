import * as React from 'react';

import { DataTable } from '@components/data-table';
import type {
  DataTableColumn,
  DataTableData,
} from '@components/data-table';

const columns: DataTableColumn[] = [
  {
    name: 'name',
  },
  {
    name: 'website',
  },
  {
    label: false,
    name: 'actions',
  }
];

export const PublishersTable = ({
  data,
}: {
  data: DataTableData,
}): JSX.Element => (
  <DataTable
    collapse
    columns={columns}
    data={data}
    name="publishers"
    scope="core"
  />
);
