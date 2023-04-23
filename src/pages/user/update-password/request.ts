import {
  faUserLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

import { useApiRequest } from '@api';
import type {
  AlertDirective,
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  RequestOptions,
  Response,
} from '@api';
import { invalidPasswordError } from '@api/errors';

type CloseForm = () => void;

const alerts: AlertDirective[] = [
  {
    errorType: invalidPasswordError,
    display: {
      context: 'pages:user:updatePassword:alerts',
      icon: faUserSlash,
      message: 'Password does not match current password.',
      type: 'failure',
    },
  },
  {
    status: 'failure',
    display: {
      context: 'pages:user:updatePassword:alerts',
      icon: faUserSlash,
      message: 'Unable to update password.',
      type: 'failure',
    },
  },
  {
    status: 'success',
    display: {
      context: 'pages:user:updatePassword:alerts',
      icon: faUserLock,
      message: 'Successfully updated password.',
      type: 'success',
    },
  },
];

export const closeFormMiddleware: Middleware =
  (fn: PerformRequest, config: MiddlewareOptions) => {
    const closeForm = config.closeForm as CloseForm;

    return async (url: string, options?: RequestOptions): Promise<Response> => {
      const response: Response = await fn(url, options);
      const { isSuccess } = response;

      if (isSuccess) { closeForm(); }

      return response;
    };
  };

export const useUpdateUserPasswordRequest = ({
  config,
}: {
  config: MiddlewareOptions,
}) => useApiRequest({
  alerts,
  config,
  method: 'patch',
  middleware: [closeFormMiddleware],
  url: '/api/authentication/user/password',
});
