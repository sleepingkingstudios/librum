import * as React from 'react';

import { DataTableCell } from './cell';
import type { DataTableColumn } from './types';

export const DataTableRow = ({
  columns,
  data,
}: {
  columns: DataTableColumn[],
  data: Record<string, unknown>,
}): JSX.Element => {
  return (
    <tr>
      {
        columns.map(
          (column: DataTableColumn): JSX.Element => (
            <DataTableCell
              column={column}
              data={data}
              key={column.name}
            />
          )
        )
      }
    </tr>
  );
};
