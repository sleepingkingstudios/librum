import * as React from 'react';
import {
  Form as FormWrapper,
  Formik,
  FormikValues,
} from 'formik';
import type { OnSubmit } from './types';

interface IBasicFormProps {
  children: React.ReactNode;
  initialValues?: FormikValues;
  onSubmit: OnSubmit;
}

export const BasicForm = (
  { children, initialValues, onSubmit }: IBasicFormProps
): JSX.Element => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <FormWrapper>
        { children }
      </FormWrapper>
    </Formik>
  )
};
