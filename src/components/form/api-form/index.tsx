import * as React from 'react';
import type { FormikValues } from 'formik';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type {
  Refetch,
  Response,
} from '@api';
import type { Animations } from '@components/types';
import { Form } from '../form';
import type {
  FormStatus,
  OnSubmit,
} from '../types';
import {
  handleSubmit,
  mapStatus,
} from './utils';

export type ApiFormProps = {
  children: React.ReactNode,
  className?: string,
  initialValues: FormikValues,
  loadingAnimation?: Animations,
  loadingIcon?: IconDefinition,
  loadingMessage?: string,
  refetch: Refetch,
  response: Response,
};

export const ApiForm = ({
  refetch,
  response,
  ...rest
}: ApiFormProps): JSX.Element => {
  const { isLoading } = response;
  const status: FormStatus = mapStatus(response);
  const onSubmit: OnSubmit = handleSubmit(refetch);

  return (
    <Form
      initialStatus={status}
      isLoading={isLoading}
      onSubmit={onSubmit}
      {...rest}
    />
  );
};
