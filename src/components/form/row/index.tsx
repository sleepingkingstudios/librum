import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';

interface IFormRowProps {
  children: React.ReactNode;
  className?: string;
  cols?: (2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12);
  colsSm?: (2 | 3 | 4 | 5 | 6);
  reverse?: true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ForceTailwindToGenerateCss = () => {
  const allColumnClasses = joinClassNames(
    'sm:grid-cols-2',
    'sm:grid-cols-3',
    'sm:grid-cols-4',
    'sm:grid-cols-5',
    'sm:grid-cols-6',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
    'lg:grid-cols-5',
    'lg:grid-cols-6',
    'lg:grid-cols-7',
    'lg:grid-cols-8',
    'lg:grid-cols-9',
    'lg:grid-cols-10',
    'lg:grid-cols-11',
    'lg:grid-cols-12',
  );

  return (
    <span className={allColumnClasses} />
  );
};

export const FormRow = ({
  children,
  className = null,
  cols = 6,
  colsSm = null,
  reverse = null,
}: IFormRowProps): JSX.Element => {
  const smallColumns = colsSm ? colsSm : Math.round(cols / 2);
  const joinedClassName = joinClassNames(
    'gap-3 sm:grid',
    `sm:grid-cols-${smallColumns}`,
    `lg:grid-cols-${cols}`,
    className
  );
  const style: React.CSSProperties = reverse ? { direction: 'rtl' } : {};

  return (
    <div className={joinedClassName} style={style}>{ children }</div>
  );
}
