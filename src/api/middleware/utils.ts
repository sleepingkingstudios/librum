import type {
  MatchFunction,
  MatcherProps,
  Matcher,
  MiddlewareOptions,
  Response,
} from '../types';

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

export const matchResponse =
  (response: Response, options: MiddlewareOptions): Matcher => {
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
