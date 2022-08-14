import type {
  FetchResponse,
  Matcher,
  MatchResponseProps,
} from './types';
import { responseMatches } from './utils';

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
