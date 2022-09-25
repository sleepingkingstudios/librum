import type { Annotations } from '@utils/annotations';
import type {
  Matcher,
  MatchResponseProps,
} from './types';
import type { FetchResponse } from '../types';
import { responseMatches } from './utils';

export { matcherMiddleware } from './middleware';
export {
  Matcher,
  MatchResponse,
  MatchResponseProps,
} from './types';

export const matchResponse = ({
  errorType = null,
  fn,
  matcher = null,
  status,
}: MatchResponseProps<unknown>): Matcher<unknown> => (
  response: FetchResponse,
  options: unknown,
) => {
  if (responseMatches({ errorType, response, status })) {
    return fn(response, options);
  }

  if (matcher !== null) {
    return matcher(response, options);
  }
};

export const reduceMatchers = <MatchOptions extends Record<string, unknown>>(
  matcherProps: MatchResponseProps<MatchOptions>[],
  annotations: Annotations = null,
): Matcher<MatchOptions> => {
  const matcher: Matcher<MatchOptions> = matcherProps.reduce(
    (
      matcher: Matcher<MatchOptions>,
      props: MatchResponseProps<MatchOptions>,
    ) => matchResponse({
      ...props,
      matcher,
    }),
    null,
  );

  if (annotations !== null) {
    matcher.annotations = {
      type: 'matcher',
      ...annotations,
    };
  }

  return matcher;
};
