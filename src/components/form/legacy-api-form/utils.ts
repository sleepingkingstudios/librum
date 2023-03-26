import type { FormikValues } from 'formik';

import type {
  ApiFailure,
  UseMutationTrigger,
} from '@api';
import { invalidParametersError } from '@api/errors';
import { camelizeErrorType } from '@api/hooks/utils';
import { convertToCamelCase } from '@utils/data';
import type {
  FormErrors,
  InvalidParametersError,
  SubmitHandler,
  SubmitHandlerOptions,
  SubmitResponse,
} from '../types';

const extractErrors = (response: ApiFailure): FormErrors => {
  if (camelizeErrorType(response.error.type) !== invalidParametersError) {
    return null;
  }

  const error = response.error as InvalidParametersError;
  const { data } = error;
  const { errors } = data;

  return convertToCamelCase(errors) as FormErrors;
};

export const handleSubmit = (
  request: UseMutationTrigger,
): SubmitHandler => async (
  values: FormikValues,
  options: SubmitHandlerOptions,
): Promise<void> => {
  const { setStatus } = options;
  const response = await request(values) as SubmitResponse;

  if (!response || !('error' in response)) {
    setStatus({ ok: true });

    return;
  }

  const { error } = response;

  if (!('data' in error) || !('status' in error) || !(typeof error.status === 'number')) {
    setStatus({ ok: false });

    return;
  }

  const data = error.data as ApiFailure;
  const errors = extractErrors(data);

  if (!errors) {
    setStatus({ ok: false });

    return;
  }

  setStatus({ ok: false, errors });
};
