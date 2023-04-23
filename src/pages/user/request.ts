import { faUser } from '@fortawesome/free-solid-svg-icons';

import { useApiQuery } from '@api';
import type { AlertDirective } from '@api';

const alerts: AlertDirective[] = [
  {
    status: 'failure',
    display: {
      context: 'pages:user:request',
      icon: faUser,
      message: 'Unable to load current user.',
      type: 'failure',
    },
  },
  {
    status: 'success',
    dismiss: 'pages:user:request',
  },
];

export const useGetUserQuery = () => useApiQuery({
  alerts,
  url: '/api/authentication/user',
});
