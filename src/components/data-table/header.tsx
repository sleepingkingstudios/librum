import * as React from 'react';
import {
  capitalize,
  kebabCase,
} from 'lodash';

import { joinClassNames } from '@utils/react-utils';
import { DataTableColumn } from './types';
import { alignmentClass } from './utils';

const labelFor = ({ column }: { column: DataTableColumn }): string => {
  if (!('label' in column)) { return titleCase(column.name); }

  const { label } = column;

  if (label === false) { return ' '; }

  return label;
};

const titleCase = (str: string):string => {
  return kebabCase(str)
    .split('-')
    .map(capitalize)
    .join(' ');
};

const DataTableHeaderCell = ({
  column,
}: {
  column: DataTableColumn,
}): JSX.Element => {
  const joinedClassName = joinClassNames(
    `data-table-header-${kebabCase(column.name)}`,
    alignmentClass(column),
  );
  const label = labelFor({ column });

  return (
    <th className={joinedClassName}>{ label }</th>
  );
};

export const DataTableHeader = ({
  columns,
}: {
  columns: DataTableColumn[],
}): JSX.Element => {
  return (
    <thead className="data-table-header">
      <tr>
        {
          columns.map((column: DataTableColumn): JSX.Element => (
            <DataTableHeaderCell key={column.name} column={column} />
          ))
        }
      </tr>
    </thead>
  );
};
