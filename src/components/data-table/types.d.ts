import * as React from 'react';

import type { Alignments } from '../types';

export type ColumnValueFunction =
  (rowData: Record<string, unknown>) => JSX.Element | string;

export type DataMappingFunction =
  (data: DataTableData) => Record<string, unknown>[];

export type DataTableColumn = {
  align?: Alignments,
  default?: string | ColumnValueFunction | React.ComponentType,
  label?: string | false,
  name: string,
  numeric?: boolean,
  value?: ColumnValueFunction | React.ComponentType,
};

export type DataTableData = Record<string, Record<string, unknown>[]>;

export type DataTableProps = {
  collapse?: boolean,
  columns: DataTableColumn[],
  data: DataTableData,
  emptyMessage?: React.ComponentType | string;
  mapping?: DataMappingFunction,
  name: string,
  scope?: string,
};
