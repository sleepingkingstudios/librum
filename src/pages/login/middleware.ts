import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

import type {
  DismissAlert,
  DisplayAlert,
  DisplayAlertProps,
} from '@alerts';
import { reduceMatchers } from '@api/matcher';
import type {
  Matcher,
  MatchResponseProps,
} from '@api/matcher';
import { matcherMiddleware } from '@api/middleware';
import type { FetchResponse } from '@api';

interface IDisplayAlertsMatcherProps extends Record<string, unknown> {
  dismissAlert: DismissAlert;
  displayAlert: DisplayAlert;
}

const failureAlert: DisplayAlertProps = {
  context: 'authentication:session',
  icon: faUserSlash,
  message: 'User not found with the provided username and password.',
  type: 'failure',
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
    const { dismissAlert } = options;

    dismissAlert('authentication:session');
  },
  status: 'success',
};

export const displayAlertsMatcher: Matcher<IDisplayAlertsMatcherProps> =
  reduceMatchers(
    [
      handleFailure,
      handleSuccess,
    ],
    { name: 'page:login:alerts' },
  );

export const displayAlerts = matcherMiddleware(
  displayAlertsMatcher,
  { name: 'page:login:alerts' },
);
