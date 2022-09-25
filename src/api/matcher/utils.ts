import { camelCase } from 'lodash';

import type { FetchResponse } from '../types';
import {
  getError,
  isFailure,
  isSuccess,
} from '../utils';

interface ResponseMatchesProps {
  errorType?: string,
  response: FetchResponse,
  status: 'success' | 'failure',
}

export const responseMatches = ({
  errorType = null,
  response,
  status,
}: ResponseMatchesProps): boolean => {
  if (status === 'success') {
    return isSuccess(response);
  }

  if (!isFailure(response)) {
    return false;
  }

  if (errorType === null) { return true; }

  const error = getError(response);

  if (error === null) { return false; }

  return camelCase(error.type) === camelCase(errorType);
};
