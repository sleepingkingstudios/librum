import type { AlertsContext } from '@alerts';
import { matchResponse } from './utils';
import type {
  AlertDirective,
  MatchFunction,
  Matcher,
  MatcherProps,
  MiddlewareOptions,
  PerformRequest,
  RequestOptions,
  Response,
} from '../types';

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

    return (response: Response, options: MiddlewareOptions) => {
      const alerts = options.alerts as AlertsContext;
      const { dismissAlert } = alerts;

      dismissAlert(dismiss);
    };
  }

  const { display } = directive;

  return (response: Response, options: MiddlewareOptions) => {
    const alerts = options.alerts as AlertsContext;
    const { displayAlert } = alerts;

    displayAlert(display);
  };
};

export const alertsMiddleware = (alerts: AlertDirective[]) => (
  (fn: PerformRequest, config: MiddlewareOptions): PerformRequest => (
    (url: string, options: RequestOptions = {}): Promise<Response> => (
      fn(url, options).then((response: Response) => {
        const matcher: Matcher = matchResponse(response, config);

        alerts.reduce(
          (memo: Matcher, directive: AlertDirective): Matcher => {
            const condition = parseCondition(directive);
            const fn = parseFunction(directive);

            return memo.on(condition, fn);
          },
          matcher,
        );

        return response;
      })
    )
  )
);
