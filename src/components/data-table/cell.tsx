import * as React from 'react';
import { kebabCase } from 'lodash';

import {
  isComponent,
  joinClassNames,
} from '@utils/react-utils';
import type {
  ColumnValueFunction,
  DataTableColumn,
} from './types';
import {
  alignmentClass,
  labelFor,
} from './utils';

type CellProps = {
  column: DataTableColumn,
  data: Record<string, unknown>,
};

const defaultFor = ({
  column,
  data,
}: CellProps): JSX.Element | string => {
  if (!('default' in column)) { return ' '; }

  if (typeof column.default === 'string') { return column.default; }

  if (typeof column.default === 'function') {
    if (isComponent(column.default)) {
      const DefaultComponent = column.default as React.ComponentType<CellProps>;

      return (<DefaultComponent column={column} data={data} />);
    }

    const fn = column.default as ColumnValueFunction;

    return fn({ data });
  }

  return ' ';
};

const isEmpty = ({ value }: { value: unknown }): boolean => {
  if (value === null) { return true; }

  if (value === undefined) { return true; }

  if (typeof value === 'string' && value.length === 0) { return true; }

  return false;
};

const valueFor = ({
  column,
  data,
}: CellProps): JSX.Element | string => {
  if (typeof column.value === 'function') {
    if (isComponent(column.value)) {
      const ValueComponent = column.value as React.ComponentType<CellProps>;

      return (<ValueComponent column={column} data={data} />);
    }

    const fn = column.value as ColumnValueFunction;

    return fn({ data });
  }

  if (column.name in data) {
    const value = data[column.name];

    if (isEmpty({ value })) { return defaultFor({ column, data }); }

    return value.toString();
  }

  return defaultFor({ column, data });
};

export const DataTableCell = ({
  column,
  data,
}: CellProps): JSX.Element => {
  const joinedClassName = joinClassNames(
    `data-table-cell-${kebabCase(column.name)}`,
    alignmentClass(column),
    column.numeric ? 'lining-nums tabular-nums' : null,
  );
  const label = labelFor({ column, force: true });
  const value = valueFor({ column, data });

  return (
    <td className={joinedClassName} data-label={label}>{ value }</td>
  );
};
