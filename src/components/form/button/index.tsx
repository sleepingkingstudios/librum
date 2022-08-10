import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';
import type { UpToTwelveColumns } from '@components/types';

interface IFormButtonProps {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  cols?: UpToTwelveColumns;
  type?: "button" | "reset" | "submit";
}

const columnSpanClassName = ({ cols }: { cols: number }): string | null => {
  if (cols === null) { return null; }

  return `col-span-${cols}`;
};

export const FormButton = ({
  className,
  children,
  disabled = false,
  cols = null,
  type = 'button',
}: IFormButtonProps): JSX.Element => {
  const joinedClassName = joinClassNames(
    'form-button',
    columnSpanClassName({ cols }),
    className,
  );

  return (
    <button
      disabled={disabled}
      className={joinedClassName}
      type={type}
    >
      { children }
    </button>
  );
};
