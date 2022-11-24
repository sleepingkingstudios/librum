import type { FormikValues } from 'formik';

import type {
  ApiFailure,
  UseMutationTrigger,
} from '@api';
import { invalidParametersError } from '@api/errors';
import { camelizeErrorType } from '@api/hooks/utils';
import { convertToCamelCase } from '@utils/data';
import type {
  FormError,
  FormErrors,
  FormStatus,
  InvalidParametersError,
  SubmitHandler,
  SubmitHandlerOptions,
  SubmitResponse,
} from './types';

const extractErrors = (response: ApiFailure): FormErrors => {
  if (camelizeErrorType(response.error.type) !== invalidParametersError) {
    return null;
  }

  const error = response.error as InvalidParametersError;
  const { data } = error;
  const { errors } = data;

  return convertToCamelCase(errors) as FormErrors;
};

export const getServerErrors = ({
  name,
  status,
}: {
  name: string,
  status: FormStatus,
}): string[] => {
  if (!status) { return []; }

  if (status.ok) { return []; }

  if (!('errors' in status)) { return []; }

  const { errors } = status;
  const fieldErrors = (errors[name] || []) as FormError[];
  const messages = fieldErrors.map(error => error.message);

  return messages;
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
