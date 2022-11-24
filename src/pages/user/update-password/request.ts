import {
  faUserLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

import type {
  Effect,
  EffectOptions,
  Response,
  UseMutationRequest,
} from '@api';
import { displayAlerts } from '@api/effects';
import { invalidPasswordError } from '@api/errors';
import { useMutationRequest } from '@api/hooks';
import { useUpdateUserPasswordMutation } from '@user/password/api';

type Options = { closeForm: () => void };

const closeFormOnSuccess: Effect = (
  response: Response,
  options: EffectOptions<Options>
) => {
  const { isSuccess } = response;
  const { closeForm } = options;

  if (!isSuccess) { return; }

  closeForm();
};

const effects: Effect[] = [
  closeFormOnSuccess,
  displayAlerts([
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
  ]),
];

export const useRequest: UseMutationRequest = ({
  options,
}: {
  options: Options,
}) => {
  const [trigger, response] = useMutationRequest({
    effects,
    options,
    useMutation: useUpdateUserPasswordMutation,
  });

  return [trigger, response];
};
