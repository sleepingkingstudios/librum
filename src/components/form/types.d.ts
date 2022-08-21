import type {
  FormikHelpers,
  FormikValues,
} from 'formik';

export type OnSubmit = (
  values: FormikValues,
  formikHelpers?: FormikHelpers<FormikValues>
) => void | Promise<unknown>;

export type SubmitHandler = (values: FormikValues) => void;
