import {
  capitalize,
  kebabCase,
} from 'lodash';

import { DataTableColumn } from './types';

const titleCase = (str: string):string => (
  kebabCase(str)
    .split('-')
    .map(capitalize)
    .join(' ')
);

export const alignmentClass = (column: DataTableColumn): string => {
  if (column.align) { return `text-${column.align}`; }

  if (column.numeric) { return 'text-right'; }

  return null;
};

export const labelFor = ({
  column,
  force = false,
}: {
  column: DataTableColumn,
  force?: boolean,
}): string => {
  if (!('label' in column)) { return titleCase(column.name); }

  const { label } = column;

  if (label === false) {
    return force ? titleCase(column.name) : ' ';
  }

  return label;
};
