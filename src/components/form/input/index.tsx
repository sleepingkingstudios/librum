import * as React from 'react';
import {
  Field,
  FieldInputProps,
  FormikProps,
} from 'formik';

import { joinClassNames } from '@utils/react-utils';

interface IFormInputProps {
  className?: string;
  id?: string;
  name: string;
  type?: string;
}

interface IInputProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldInputProps<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormikProps<any>;
  id?: string;
  type?: string;
}

const Input = ({
  className,
  field,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form,
  id,
  type = 'text',
}: IInputProps): JSX.Element => {
  return (
    <input id={id} className={className} type={type} {...field} />
  );
};

export const FormInput = (
  {
    className,
    id,
    name,
    type,
  }: IFormInputProps
): JSX.Element => {
  const joinedClassName = joinClassNames(
    'bg-zinc-200 dark:bg-zinc-800 border border-solid border-zinc-900 dark:border-zinc-100 m-2 p-1 rounded-lg',
    className,
  );

  return (
    <Field id={id} className={joinedClassName} name={name} component={Input} type={type} />
  );
};
