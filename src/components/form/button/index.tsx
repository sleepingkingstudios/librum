import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';

interface IFormButtonProps {
  className?: string;
  children: React.ReactNode;
  cols?: (2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12);
  type?: "button" | "reset" | "submit";
}

const columnSpanClassName = ({ cols }: { cols: number }): string | null => {
  if (cols === null) { return null; }

  return `col-span-${cols}`;
};

export const FormButton = ({
  className,
  children,
  cols = null,
  type = 'button',
}: IFormButtonProps): JSX.Element => {
  const joinedClassName = joinClassNames(
    'form-button',
    columnSpanClassName({ cols }),
    className,
  );

  return (
    <button className={joinedClassName} type={type}>{ children }</button>
  );
};
