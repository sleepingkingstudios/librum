import {
  faUserLock,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';

import type {
  DisplayAlert,
  DisplayAlertProps,
} from '@alerts';
import type { FetchResponse } from '@api';
import {
  matcherMiddleware,
  reduceMatchers,
} from '@api/matcher';
import type {
  Matcher,
  MatchResponseProps,
} from '@api/matcher';
import { isSuccess } from '@api/utils';
import type {
  Middleware,
  MiddlewareBuilder,
} from '@utils/middleware';

interface IDisplayAlertsMatcherProps extends Record<string, unknown> {
  displayAlert: DisplayAlert;
}

const failureAlert: DisplayAlertProps = {
  context: 'pages:user:updatePassword:alerts',
  icon: faUserSlash,
  message: 'Unable to update password.',
  type: 'failure',
};

const successAlert: DisplayAlertProps = {
  context: 'pages:user:updatePassword:alerts',
  icon: faUserLock,
  message: 'Successfully updated password.',
  type: 'success',
};

const handleFailure: MatchResponseProps<IDisplayAlertsMatcherProps> = {
  fn: (response: FetchResponse, options: IDisplayAlertsMatcherProps): void => {
    const { displayAlert } = options;

    displayAlert(failureAlert);
  },
  status: 'failure',
};

const handleSuccess: MatchResponseProps<IDisplayAlertsMatcherProps> = {
  fn: (response: FetchResponse, options: IDisplayAlertsMatcherProps): void => {
    const { displayAlert } = options;

    displayAlert(successAlert);
  },
  status: 'success',
};

const closeFormOnSuccess: MiddlewareBuilder = (
  { closeForm }: { closeForm: () => void }
): Middleware => {
  const middleware: Middleware = async (fn, params) => {
    const response = await fn(params);

    if (isSuccess(response)) { closeForm(); }

    return response;
  };

  return middleware;
};

closeFormOnSuccess.annotations = {
  name: 'pages:user:updatePassword:closeFormOnSuccess',
  type: 'middleware',
};

export { closeFormOnSuccess };

export const displayAlertsMatcher: Matcher<IDisplayAlertsMatcherProps> =
  reduceMatchers(
    [
      handleFailure,
      handleSuccess,
    ],
    { name: 'pages:user:updatePassword:alerts' },
  );

export const displayAlerts = matcherMiddleware(
  displayAlertsMatcher,
  { name: 'pages:user:updatePassword:alerts' },
);
