import type {
  FormikHelpers,
  FormikValues,
} from 'formik';
import type {
  Mutation,
  OnSubmit,
  QueryParams,
} from './types';

type WrapMutation = {
  mutation: Mutation;
  params?: QueryParams;
}

export const wrapMutation = (
  { mutation, params = {} }: WrapMutation
): OnSubmit => (
  async (
    values: FormikValues,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formikHelpers: FormikHelpers<FormikValues>
  ): Promise<unknown> => {
    const param = {
      ...values,
      ...params,
    };

    return await mutation(param);
  }
);
