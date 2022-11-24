import * as React from 'react';
import {
  Form as FormWrapper,
  Formik,
  FormikValues,
} from 'formik';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type {
  Response,
  UseMutationTrigger,
} from '@api';
import { LoadingOverlay } from '@components/loading-overlay';
import type { Animations } from '@components/types';
import { joinClassNames } from '@utils/react-utils';
import { handleSubmit } from './utils';

export { FormButton } from './button';
export { FormField } from './field';
export { FormInput } from './input';
export { FormRow } from './row';
export { FormSubmitButton } from './submit-button';

interface FormProps {
  children: React.ReactNode;
  className?: string;
  initialValues?: FormikValues;
  loadingAnimation?: Animations;
  loadingIcon?: IconDefinition;
  loadingMessage?: string;
  request: UseMutationTrigger;
  response: Response;
}

interface RenderLoadingOverlay {
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
}: RenderLoadingOverlay): JSX.Element => {
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
    request,
    response,
  }: FormProps
): JSX.Element => {
  const { isLoading } = response;
  const joinedClassName = joinClassNames(
    className,
    'relative',
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit(request)}>
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
  );
};
