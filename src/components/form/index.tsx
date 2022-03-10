import * as React from 'react';
import {
  Form as FormWrapper,
  Formik,
  FormikHelpers,
  FormikValues,
} from 'formik';

export { FormInput } from './input';

type submitHandler = (
  values: FormikValues,
  formikHelpers: FormikHelpers<FormikValues>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => void | Promise<any>;

interface IFormProps {
  children: React.ReactNode;
  initialValues?: FormikValues;
  onSubmit: submitHandler;
}

export const Form = (
  { children, initialValues, onSubmit }: IFormProps
): JSX.Element => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <FormWrapper>
        { children }
      </FormWrapper>
    </Formik>
  )
};
