import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

import type {
  Effect,
  EffectOptions,
  Response,
  UseMutationRequest,
} from '@api';
import { displayAlerts } from '@api/effects';
import { useMutationRequest } from '@api/hooks';
import type {
  Session,
  User,
} from '@session';
import { useCreateSessionMutation } from '@session/api';
import { actions as sessionActions } from '@session/reducer';
import { setStoredSession } from '@session/utils';
import type { Action } from '@store';

const createSession: Effect = (
  response: Response<{ token: string, user: User }>,
  options: EffectOptions,
): void => {
  const { data, isSuccess } = response;

  if (!isSuccess) { return; }

  const { create } = sessionActions;
  const { dispatch } = options;
  const { token, user } = data;
  const action: Action<Session> = create({ token, user });

  dispatch(action);

  const session: Session = {
    authenticated: true,
    token,
    user,
  };

  setStoredSession(session);
};

const effects: Effect[] = [
  createSession,
  displayAlerts([
    {
      dismiss: 'authentication:session',
      status: 'success',
    },
    {
      display:  {
        context: 'authentication:session',
        icon: faUserSlash,
        message: 'User not found with the provided username and password.',
        type: 'failure',
      },
      status: 'failure',
    }
  ]),
];

export const useRequest: UseMutationRequest = () => {
  const [trigger, response] = useMutationRequest({
    effects,
    useMutation: useCreateSessionMutation,
  });

  return [trigger, response];
};
