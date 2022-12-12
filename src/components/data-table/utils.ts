import { DataTableColumn } from './types';

export const alignmentClass = (column: DataTableColumn): string => {
  if (column.align) { return `text-${column.align}`; }

  if (column.numeric) { return 'text-right'; }

  return null;
};
