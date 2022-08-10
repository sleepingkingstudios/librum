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
import type { Middleware } from '@utils/middleware';

export { FormButton } from './button';
export { FormField } from './field';
export { FormInput } from './input';
export { FormRow } from './row';
export { FormSubmitButton } from './submit-button';

interface IFormProps {
  children: React.ReactNode;
  initialValues?: FormikValues;
  middleware?: Middleware | Middleware[];
  params?: QueryParams;
  useMutation: UseMutation;
}

export const Form = (
  {
    children,
    initialValues,
    middleware,
    params,
    useMutation,
  }: IFormProps
): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mutation, status] = useMutation();
  const onSubmit: OnSubmit = wrapMutation({ middleware, mutation, params });

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <FormWrapper>
        { children }
      </FormWrapper>
    </Formik>
  )
};
