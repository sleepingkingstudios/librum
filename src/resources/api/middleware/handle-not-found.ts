import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import type { AlertsContext } from '@alerts';
import { notFoundError } from '@api/errors';
import type {
  ApiError,
  Middleware,
  MiddlewareOptions,
  PerformRequest,
  RequestOptions,
  Response,
} from '@api/types';
import { configuredRouteFor } from '@resources/routes/utils';
import { singularize } from '@utils/inflector';
import { titleCase } from '@utils/text';
import type { UseResourceQueryOptions } from '../use-resource-query';
import { generateAlertContext } from '../utils';

type Navigate = (url: string) => void;

const extractSlug = (error: ApiError): string => {
  const { data } = error;

  if (!('attributeValue' in data)) { return null; }

  const { attributeValue } = data;

  return attributeValue as string;
};

const generateLabel = ({
  member,
  resourceName,
  singularName,
}: {
  member: boolean,
  resourceName: string,
  singularName?: string,
}): string => {
  if (!member) { return resourceName; }

  if (singularName) { return singularName; }

  return singularize(resourceName);
};

const generateMessage = ({
  expected,
  member,
  resourceName,
  singularName,
}: {
  expected: string,
  member: boolean,
  resourceName: string,
  singularName?: string,
}): string => {
  const label = titleCase(
    generateLabel({ member, resourceName, singularName })
  );
  const message = `${label} not found`;

  if (expected) {
    return `${message} with slug "${expected}"`;
  }

  return message;
};

export const handleNotFoundMiddleware =
  ({
    action,
    member,
    resourceName,
    route,
    scope,
    singularName,
  }: UseResourceQueryOptions): Middleware => (
    (fn: PerformRequest, config: MiddlewareOptions): PerformRequest => (
      async (url: string, options: RequestOptions = {}): Promise<Response> => {
        const response = await fn(url, options);
        const { errorType, hasError } = response;

        if (!(hasError && errorType === notFoundError)) { return response; }

        const alerts = config.alerts as AlertsContext;
        const { displayAlert } = alerts;
        const navigate = config.navigate as Navigate;
        const collectionPath = configuredRouteFor({
          resourceName,
          route,
          scope,
        });

        displayAlert({
          context: generateAlertContext({ action, resourceName, scope }),
          icon: faMagnifyingGlass,
          message: generateMessage({
            expected: extractSlug(response.error as ApiError),
            member,
            resourceName,
            singularName,
          }),
          type: 'failure',
        });

        navigate(collectionPath);

        return response;
      }
    )
  );
