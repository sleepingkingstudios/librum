import * as React from 'react';
import type { FieldInputProps } from 'formik';

import { joinClassNames } from '@utils/react-utils';

interface IInputProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldInputProps<any>;
  id?: string;
  type?: string;
}

export const FormInput = ({
  className,
  field,
  id,
  type = 'text',
}: IInputProps): JSX.Element => {
  const joinedClassName = joinClassNames(
    'form-input',
    className,
  );

  return (
    <input id={id} className={joinedClassName} type={type} {...field} />
  );
};
