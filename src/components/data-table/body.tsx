import * as React from 'react';
import { kebabCase } from 'lodash';

import { DataTableRow } from './row';
import type { DataTableColumn } from './types';

const emptyMessageFor = ({
  emptyMessage,
  name,
}: {
  emptyMessage: React.ComponentType | string,
  name: string,
}): JSX.Element | string => {
  if (typeof emptyMessage === 'function') {
    const EmptyMessage = emptyMessage;

    return (<EmptyMessage />);
  }

  if (typeof emptyMessage === 'string') { return emptyMessage; }

  return `There are no matching ${kebabCase(name).replace(/-/g, ' ')}.`;
};

export const DataTableBody = ({
  columns,
  data,
  emptyMessage,
  name,
}: {
  columns: DataTableColumn[],
  data: Record<string, unknown>[],
  emptyMessage?: React.ComponentType | string,
  name: string,
}): JSX.Element => {
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td className="data-table-empty" colSpan={columns.length}>
            { emptyMessageFor({ emptyMessage, name }) }
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {
        data.map(
          (rowData: Record<string, unknown>, index: number) => (
            <DataTableRow
              columns={columns}
              data={rowData}
              key={`${name}-${index}`}
            />
          )
        )
      }
    </tbody>
  );
};
