import * as React from 'react';
import {
  Form,
  Formik,
  FormikHelpers,
  FormikValues,
} from 'formik';

export type onSubmitType = (
  values: FormikValues,
  formikHelpers: FormikHelpers<FormikValues>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => void | Promise<any>;

export type submitHandlerType = (values: FormikValues) => void;

interface IFormWrapperProps {
  initialValues?: FormikValues;
  onSubmit?: onSubmitType;
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
