import * as React from 'react';
import {
  Form as FormWrapper,
  Formik,
} from 'formik';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { LoadingOverlay } from '@components/loading-overlay';
import type { Animations } from '@components/types';
import { joinClassNames } from '@utils/react-utils';
import type { FormProps } from './types';

const renderLoadingOverlay = ({
  isLoading,
  loadingAnimation,
  loadingIcon,
  loadingMessage,
}: {
  isLoading: boolean;
  loadingAnimation?: Animations;
  loadingIcon?: IconDefinition;
  loadingMessage?: string;
}): JSX.Element => {
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
    initialStatus,
    initialValues,
    isLoading = false,
    loadingAnimation,
    loadingIcon,
    loadingMessage = null,
    onSubmit,
  }: FormProps
): JSX.Element => {
  const joinedClassName = joinClassNames(
    className,
    'relative',
  );

  return (
    <Formik
      initialStatus={initialStatus}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
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
