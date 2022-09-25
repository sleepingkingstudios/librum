import type { FetchResponse } from '@api';
import { expiredSessionError } from '@api/errors';
import {
  matcherMiddleware,
  reduceMatchers,
} from '@api/matcher';
import type {
  Matcher,
  MatchResponseProps,
} from '@api/matcher';
import type {
  Action,
  ActionCreator,
  Dispatch,
} from '@store';

type MatcherProps = {
  destroySession: ActionCreator<
    unknown,
    { authenticated: false }
  >,
  dispatch: Dispatch,
  setItem: SetItem,
};

type SetItem = (key: string, value: unknown) => unknown;

const handleExpired: MatchResponseProps<MatcherProps> = {
  errorType: expiredSessionError,
  fn: (response: FetchResponse, options: MatcherProps): void => {
    const {
      destroySession,
      dispatch,
      setItem,
    } = options;

    setItem('session', null);

    const action: Action = destroySession({});

    dispatch(action);
  },
  status: 'failure',
};

export const clearSessionOnExpiredMatcher: Matcher<MatcherProps> =
  reduceMatchers(
    [handleExpired],
    { name: 'session:middleware:clearSessionOnExpired' },
  );

export const clearSessionOnExpired = matcherMiddleware(
  clearSessionOnExpiredMatcher,
  { name: 'session:middleware:clearSessionOnExpired' },
);
