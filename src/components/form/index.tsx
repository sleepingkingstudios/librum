import * as React from 'react';
import {
  Form as FormWrapper,
  Formik,
  FormikValues,
} from 'formik';
import type {
  OnSubmit,
  QueryParams,
  UseMutation,
} from './types';
import { wrapMutation } from './utils';

export { FormInput } from './input';

interface IFormProps {
  children: React.ReactNode;
  initialValues?: FormikValues;
  params?: QueryParams;
  useMutation: UseMutation;
}

export const Form = (
  {
    children,
    initialValues,
    params,
    useMutation,
  }: IFormProps
): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mutation, status] = useMutation();
  const onSubmit: OnSubmit = wrapMutation({ mutation, params });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <FormWrapper>
        { children }
      </FormWrapper>
    </Formik>
  )
};
