import * as React from 'react';

import { joinClassNames } from '@utils/react-utils';

interface IFormButtonProps {
  className?: string;
  children: string | JSX.Element | (string | JSX.Element)[];
  type?: "button" | "reset" | "submit";
}

export const FormButton = ({
  className,
  children,
  type = 'button',
}: IFormButtonProps): JSX.Element => {
  const joinedClassName = joinClassNames(
    'form-button',
    className,
  );

  return (
    <button className={joinedClassName} type={type}>{ children }</button>
  );
};
