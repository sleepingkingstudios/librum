import { faUser } from '@fortawesome/free-solid-svg-icons';

import type { DisplayAlertProps } from '@alerts';
import { displayAlerts } from '@api/effects';
import type { Effect } from '@api/effects';
import { useQueryRequest } from '@api/hooks';
import type { User } from '@session';
import { useGetUserQuery } from '@user/api';

const failureAlert: DisplayAlertProps = {
  context: 'pages:user:request',
  icon: faUser,
  message: 'Unable to load current user.',
  type: 'failure',
};

export const useGetUserRequest = () => {
  const effects: Effect[] = [
    displayAlerts([{ status: 'failure', display: failureAlert }]),
  ];

  return useQueryRequest<{ user: User }>({
    effects,
    useQuery: useGetUserQuery,
  });
};
