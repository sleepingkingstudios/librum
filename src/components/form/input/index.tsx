import * as React from 'react';
import type {
  FieldInputProps,
  FormikProps,
} from 'formik';

interface IInputProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldInputProps<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: FormikProps<any>;
  id?: string;
  type?: string;
}

export const FormInput = ({
  className,
  field,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form,
  id,
  type = 'text',
}: IInputProps): JSX.Element => (
  <input id={id} className={className} type={type} {...field} />
);
