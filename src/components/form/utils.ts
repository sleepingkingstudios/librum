import type {
  FormikHelpers,
  FormikValues,
} from 'formik';

import type {
  Mutation,
  OnSubmit,
  QueryParams,
} from './types';
import { applyMiddleware } from '@utils/middleware';
import type { Middleware } from '@utils/middleware';

type WrapMutation = {
  middleware?: Middleware | Middleware[];
  mutation: Mutation;
  params?: QueryParams;
}

export const wrapMutation = (
  {
    middleware,
    mutation,
    params = {}
  }: WrapMutation
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

    return await applyMiddleware(mutation, middleware)(param);
  }
);
