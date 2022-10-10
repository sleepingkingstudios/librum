import type {
  Response,
  ResponseStatus,
} from '../hooks/types';
import type { EffectOptions } from './types';

export type MatchFunction = (response: Response, options: EffectOptions) => void;

export type MatcherProps = {
  errorType: string;
} | {
  status: ResponseStatus;
};

export type Matcher = {
  on: (match: MatcherProps, fn: MatchFunction) => Matcher;
};

const matches = (response: Response, match: MatcherProps): boolean => {
  if ('errorType' in match) {
    const { errorType } = response;

    return match.errorType === errorType;
  } else {
    const { status } = response;

    return match.status === status;
  }
};

const nullMatcher: Matcher = {
  on: () => nullMatcher,
};

export const match = (response: Response, options: EffectOptions): Matcher => {
  const matcher: Matcher = {
    on: (match: MatcherProps, fn: MatchFunction) => {
      if(matches(response, match)) {
        fn(response, options);

        return nullMatcher;
      } else {
        return matcher;
      }
    },
  };

  return matcher;
};
