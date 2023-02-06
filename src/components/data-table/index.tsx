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
  collapse,
  columns,
  data,
  emptyMessage,
  mapping,
  name,
  scope,
}: DataTableProps): JSX.Element => {
  const suffix = kebabCase(scope ? `${scope}-${name}` : name);
  const tableData = mapping ? mapping(data) : (data[name] || []);
  const joinedClassName = joinClassNames(
    'data-table',
    collapse ? 'data-table-collapse' : null,
    `data-table-${suffix}`,
  );

  return (
    <figure className={joinedClassName}>
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
