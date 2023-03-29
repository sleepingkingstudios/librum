import * as React from 'react';
import type { FormikValues } from 'formik';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type {
  Response,
  UseMutationTrigger,
} from '@api';
import type { Animations } from '@components/types';
import { Form } from '../form';
import type { OnSubmit } from '../types';
import { handleSubmit } from './utils';

export type LegacyFormProps = {
  children: React.ReactNode,
  className?: string,
  initialValues: FormikValues,
  loadingAnimation?: Animations,
  loadingIcon?: IconDefinition,
  loadingMessage?: string,
  request: UseMutationTrigger,
  response: Response,
};

export const LegacyApiForm = ({
  request,
  response,
  ...rest
}: LegacyFormProps): JSX.Element => {
  const { isLoading } = response;
  const onSubmit: OnSubmit = handleSubmit(request);

  return (<Form isLoading={isLoading} onSubmit={onSubmit} {...rest} />);
};
