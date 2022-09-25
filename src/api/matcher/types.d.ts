import type { Annotated } from '@utils/annotations';
import type { FetchResponse } from '../types';

export type Matcher<MatchOptions> = (
  (
    response: FetchResponse,
    options: MatchOptions,
  ) => void
) & Annotated;

export type MatchResponseProps<MatchOptions> = {
  errorType?: string,
  fn: Matcher<MatchOptions>,
  matcher?: Matcher<MatchOptions>,
  status: 'success' | 'failure',
}

export type MatchResponse<MatchOptions> = ({
  errorType,
  matcher,
  status,
}: MatchResponseProps) => Matcher<MatchOptions>;
