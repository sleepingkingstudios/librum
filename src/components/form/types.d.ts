import type {
  FormikHelpers,
  FormikValues,
} from 'formik';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import type { Animations } from '@components/types';

export type FailureResponse = {
  error: Record<string, unknown>,
};

export type FormError = {
  data: Record<string, unknown>,
  message: string,
  type: string,
  path: Array<string>,
};

export type FormErrors = Record<string, FormError[]>;

export type FormProps = {
  children: React.ReactNode,
  className?: string,
  initialStatus?: FormStatus,
  initialValues: FormikValues,
  isLoading?: boolean,
  loadingAnimation?: Animations,
  loadingIcon?: IconDefinition,
  loadingMessage?: string,
  onSubmit: OnSubmit,
};

export type FormStatus = {
  ok: boolean,
  errors?: FormErrors,
};

export type InvalidParametersError = {
  data: {
    errors: FormErrors,
  },
  message: string,
  type: string,
};

export type OnSubmit = (
  values: FormikValues,
  formikHelpers?: FormikHelpers<FormikValues>
) => void | Promise<unknown>;

export type SetStatus = (status?: unknown) => void;

export type SubmitHandler = (
  values: FormikValues,
  options: SubmitHandlerOptions,
) => Promise<unknown> | void;

export type SubmitHandlerOptions = {
  setStatus: SetStatus,
};

export type SubmitResponse = FailureResponse | SuccessResponse;

export type SuccessResponse = {
  data: Record<string, unknown>,
};
