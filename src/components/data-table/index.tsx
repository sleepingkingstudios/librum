import * as React from 'react';
import { kebabCase } from 'lodash';

import { joinClassNames } from '@utils/react-utils';
import { DataTableBody } from './body';
import { DataTableHeader } from './header';
import type { DataTableProps } from './types';

export type {
  DataTableColumn,
  DataTableData,
} from './types';

export const DataTable = ({
  columns,
  data,
  emptyMessage,
  mapping,
  name,
  scope,
}: DataTableProps): JSX.Element => {
  const suffix = kebabCase(scope ? `${scope}-${name}` : name);
  const tableData = mapping ? mapping(data) : (data[name] || []);

  return (
    <figure className={joinClassNames('data-table', `data-table-${suffix}`)}>
      <table>
        <DataTableHeader columns={columns} />

        <DataTableBody
          columns={columns}
          data={tableData}
          emptyMessage={emptyMessage}
          name={name}
        />
      </table>
    </figure>
  );
};
