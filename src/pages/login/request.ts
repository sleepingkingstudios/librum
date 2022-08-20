import { buildRequest } from '@api';
import type { UseMutation } from '@api';
import { useCreateSessionMutation } from '@session/api';
import {
  createSession,
  storeSession,
} from '@session/middleware';
import { displayAlerts } from './middleware';

const useMutation: UseMutation = useCreateSessionMutation;

useMutation.annotations = {
  name: 'useCreateSessionMutation',
  type: 'hooks:useMutation',
};

export { useMutation };

export const useRequest = buildRequest(
  {
    middleware: [
      createSession,
      storeSession,
      displayAlerts,
    ],
  },
  {
    name: 'pages:login:request',
  },
);
