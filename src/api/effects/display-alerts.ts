import type { DisplayAlertProps } from '@alerts';
import type {
  Effect,
  EffectOptions,
  Response,
  ResponseStatus,
} from '../types';
import { match } from './matcher';
import type {
  MatchFunction,
  Matcher,
  MatcherProps,
} from './matcher';

export type AlertDirective = {
  dismiss: string,
  errorType: string,
} | {
  dismiss: string,
  status: ResponseStatus,
} | {
  display: DisplayAlertProps,
  errorType: string,
} | {
  display: DisplayAlertProps,
  status: ResponseStatus,
};

const parseCondition = (directive: AlertDirective): MatcherProps => {
  if ('errorType' in directive) {
    const { errorType } = directive;

    return { errorType };
  }

  const { status } = directive;

  return { status };
};

const parseFunction = (directive: AlertDirective): MatchFunction => {
  if ('dismiss' in directive) {
    const { dismiss } = directive;

    return (response: Response, options: EffectOptions) => {
      const { alerts } = options;
      const { dismissAlert } = alerts;

      dismissAlert(dismiss);
    };
  }

  const { display } = directive;

  return (response: Response, options: EffectOptions) => {
    const { alerts } = options;
    const { displayAlert } = alerts;

    displayAlert(display);
  };
};

export const displayAlerts = (
  directives: AlertDirective[],
): Effect => (response: Response, options: EffectOptions) => {
  const matcher: Matcher = match(response, options);

  directives.reduce(
    (memo: Matcher, directive: AlertDirective): Matcher => {
      const condition = parseCondition(directive);
      const fn = parseFunction(directive);

      return memo.on(condition, fn);
    },
    matcher,
  );
};
