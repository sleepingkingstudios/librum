import * as React from 'react';
import {
  Form as FormWrapper,
  Formik,
  FormikValues,
} from 'formik';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { LoadingOverlay } from '@components/loading-overlay';
import type { Animations } from '@components/types';
import type { Middleware } from '@utils/middleware';
import { joinClassNames } from '@utils/react-utils';
import { wrapMutation } from './utils';
import type {
  OnSubmit,
  QueryParams,
  UseMutation,
} from './types';

export { FormButton } from './button';
export { FormField } from './field';
export { FormInput } from './input';
export { FormRow } from './row';
export { FormSubmitButton } from './submit-button';

interface IFormProps {
  children: React.ReactNode;
  className?: string;
  initialValues?: FormikValues;
  loadingAnimation?: Animations;
  loadingIcon?: IconDefinition;
  loadingMessage?: string;
  middleware?: Middleware | Middleware[];
  params?: QueryParams;
  useMutation: UseMutation;
}

interface IRenderLoadingOverlay {
  isLoading: boolean;
  loadingAnimation?: Animations;
  loadingIcon?: IconDefinition;
  loadingMessage?: string;
}

const renderLoadingOverlay = ({
  isLoading,
  loadingAnimation,
  loadingIcon,
  loadingMessage,
}: IRenderLoadingOverlay): JSX.Element => {
  if (!isLoading) { return null; }

  return (
    <LoadingOverlay
      animate={loadingAnimation}
      icon={loadingIcon}
      message={loadingMessage}
    />
  );
};

export const Form = (
  {
    children,
    className = null,
    initialValues,
    loadingAnimation,
    loadingIcon,
    loadingMessage = null,
    middleware,
    params,
    useMutation,
  }: IFormProps
): JSX.Element => {
  const [mutation, status] = useMutation();
  const { isLoading } = status;
  const onSubmit: OnSubmit = wrapMutation({ middleware, mutation, params });
  const joinedClassName = joinClassNames(
    className,
    'relative',
  );

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <FormWrapper className={joinedClassName}>
        {
          renderLoadingOverlay({
            isLoading,
            loadingAnimation,
            loadingIcon,
            loadingMessage,
          })
        }

        { children }
      </FormWrapper>
    </Formik>
  )
};
