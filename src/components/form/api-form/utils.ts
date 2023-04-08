import type { FormikValues } from 'formik';

import type {
  Refetch,
  RefetchOptions,
  RequestBody,
  Response,
} from '@api';
import { invalidParametersError } from '@api/errors';
import type {
  FormStatus,
  InvalidParametersError,
  SubmitHandler,
  SubmitHandlerOptions,
} from '../types';

export const handleSubmit = (
  refetch: Refetch,
): SubmitHandler => async (
  values: FormikValues,
  options: SubmitHandlerOptions,
): Promise<Response> => {
  const { setStatus } = options;
  const body: RequestBody = values;
  const request: RefetchOptions = { body };

  const response: Response = await refetch(request);

  const status: FormStatus = mapStatus(response);

  setStatus(status);

  return new Promise(resolve => resolve(response));
};

export const mapStatus = (response: Response): FormStatus => {
  const { errorType, hasError, status } = response;

  if (status !== 'failure') { return { ok: true }; }

  if (!hasError || typeof response.error === 'string') { return { ok: false }; }

  if (errorType !== invalidParametersError) { return { ok: false }; }

  const error = response.error as InvalidParametersError;
  const { data } = error;
  const { errors } = data;

  return { ok: false, errors };
};
