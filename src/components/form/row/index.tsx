import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';
import type {
  UpToSixColumns,
  UpToTwelveColumns,
} from '../../types';

interface IFormRowProps {
  children: React.ReactNode;
  className?: string;
  cols?: UpToTwelveColumns;
  colsSm?: UpToSixColumns;
  reverse?: true;
}

interface IGridClassName {
  cols?: UpToTwelveColumns,
  colsSm?: UpToSixColumns,
}

const gridClassName = ({ cols, colsSm }: IGridClassName): string | null => {
  if (cols === null) { return null; }

  const largeColumns = cols;
  const smallColumns = colsSm ? colsSm : Math.round(cols / 2);

  return joinClassNames(
    'gap-3 sm:grid',
    `sm:grid-cols-${smallColumns}`,
    `lg:grid-cols-${largeColumns}`,
  );
};

export const FormRow = ({
  children,
  className = null,
  cols = null,
  colsSm = null,
  reverse = null,
}: IFormRowProps): JSX.Element => {
  const joinedClassName = joinClassNames(
    gridClassName({ cols, colsSm }),
    className,
  );
  const style: React.CSSProperties = reverse ? { direction: 'rtl' } : {};

  return (
    <div className={joinedClassName} style={style}>{ children }</div>
  );
}
