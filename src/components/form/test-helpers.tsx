import * as React from 'react';
import {
  Form,
  Formik,
  FormikValues,
} from 'formik';

import type { OnSubmit } from './types';

interface IFormWrapperProps {
  initialValues?: FormikValues;
  onSubmit?: OnSubmit;
  submitButton?: true | false;
}

const SubmitButton = (
  { submitButton }: { submitButton: true | false }
): JSX.Element => {
  if (!submitButton) { return null; }

  return (
    <button type="submit">Submit</button>
  );
};

export const formWrapper = (
  { initialValues, onSubmit, submitButton }: IFormWrapperProps) => {
  const FormWrapper = (
    { children }: { children: React.ReactNode }
  ): JSX.Element => (
    <Formik initialValues={initialValues || {}} onSubmit={onSubmit}>
      <Form>
        { children }

        <SubmitButton submitButton={submitButton} />
      </Form>
    </Formik>
  );

  return FormWrapper;
};
