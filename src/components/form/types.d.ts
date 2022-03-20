import type {
  FormikHelpers,
  FormikValues,
} from 'formik';

export type Mutation = (param?: unknown) => unknown;

export type OnSubmit = (
  values: FormikValues,
  formikHelpers?: FormikHelpers<FormikValues>
) => void | Promise<unknown>;

export type QueryParams = Record<string, unknown>;

export type SubmitHandler = (values: FormikValues) => void;

export type UseMutation = () => readonly [
  Mutation,
  unknown,
];
