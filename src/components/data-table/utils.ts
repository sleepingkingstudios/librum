import { titleCase } from '@utils/text';
import { DataTableColumn } from './types';

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
