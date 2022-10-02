import { buildRequest } from '@api';
import type { UseMutation } from '@api';
import { clearSessionOnExpired } from '@session/middleware';
import { useUpdateUserPasswordMutation } from '@user/password/api';
import {
  closeFormOnSuccess,
  displayAlerts,
} from './middleware';

const useMutation: UseMutation = useUpdateUserPasswordMutation;

useMutation.annotations = {
  name: 'useUpdateUserPasswordMutation',
  type: 'hooks:useMutation',
};

export { useMutation };

export const useRequest = buildRequest(
  {
    middleware: [
      clearSessionOnExpired,
      closeFormOnSuccess,
      displayAlerts,
    ],
  },
  {
    name: 'pages:user:updatePassword:request',
  },
);
