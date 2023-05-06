import * as React from 'react';

import { kebabCase } from 'lodash';
import { Route } from 'react-router-dom';

import { singularize } from '@utils/inflector';
import { upperCamelCase } from '@utils/text';
import type {
  ResourcePageComponent,
  ResourcePageRouteOptions,
  ResourcePagesConfiguration,
  ResourceRoutesProps,
} from '../types';
import { configuredRouteFor } from './utils';

type MaybeOptions = false | ResourcePageRouteOptions;

const defaultPages: Record<string, ResourcePageRouteOptions> = {
  index: {
    member: false,
    route: '/',
  },
  show: {
    member: true,
    route: '/',
  },
};

const filterPages = (
  pages: Record<string, ResourcePageRouteOptions>,
  fn: (page: ResourcePageRouteOptions) => boolean,
): Record<string, ResourcePageRouteOptions> => Object.fromEntries(
  Object
    .entries(pages)
    .filter(
      (
        tuple: [string, ResourcePageRouteOptions]
      ): boolean => fn(tuple[1])
    )
);

const generateCollectionRoutes = ({
  Pages,
  pages,
}: {
  Pages: Record<string, ResourcePageComponent>,
  pages: ResourcePagesConfiguration,
}): JSX.Element => (
  <>
    {
      Object
        .entries(pages)
        .map(
          (tuple: [string, ResourcePageRouteOptions]): JSX.Element => {
            const [action, page] = tuple;
            const { route } = page;
            const Page = Pages[`${upperCamelCase(action)}Page`];

            return generateRoute({ Page, action, route });
          }
        )
    }
  </>
);

const generateMemberRoutes = ({
  Pages,
  pages,
  resourceName,
  singularName,
}: {
  Pages: Record<string, ResourcePageComponent>,
  pages: ResourcePagesConfiguration,
  resourceName: string,
  singularName?: string,
}): JSX.Element => {
  const name = singularName || singularize(resourceName);

  return (
    <Route path={`:${name}Id`}>
      {
        Object
          .entries(pages)
          .map(
            (tuple: [string, ResourcePageRouteOptions]): JSX.Element => {
              const [action, page] = tuple;
              const { route } = page;
              const Page = Pages[`${upperCamelCase(action)}Page`];

              return generateRoute({ Page, action, route });
            }
          )
      }
    </Route>
  );
};

const generatePath = ({
  action,
  route,
}: {
  action: string,
  route?: string,
}): string => {
  if (route === undefined || route === null) { return kebabCase(action); }

  return kebabCase(route.replace(/^\//, '').replace(/\/$/, ''));
};

const generateRoute = ({
  Page,
  action,
  route,
}: {
  Page: ResourcePageComponent,
  action: string,
  route?: string,
}): JSX.Element => {
  const path = generatePath({ action, route });

  if (path.length === 0) {
    return (
      <Route index element={<Page />} key={action} />
    );
  }

  return (
    <Route path={path} element={<Page />} key={action} />
  );
};

const isCollectionPage = (page: ResourcePageRouteOptions): boolean => {
  const { member } = page;

  return !member;
};

const isMemberPage = (page: ResourcePageRouteOptions): boolean => {
  const { member } = page;

  return member;
};

export const generateResourceRoutes = ({
  Pages,
  pages,
  resourceName,
  singularName,
  route,
  scope,
}: ResourceRoutesProps): JSX.Element => {
  const configured: ResourcePagesConfiguration = pages || {};
  const path = configuredRouteFor({ resourceName, route, scope });
  const actions: string[] = Object
    .entries({ ...defaultPages, ...pages })
    .filter(
      (tuple: [string, MaybeOptions]): boolean => {
        const value = tuple[1];

        return !!value;
      }
    )
    .map(
      (tuple: [string, ResourcePageRouteOptions]): string => tuple[0]
    );
  const options: Record<string, ResourcePageRouteOptions> =
    Object.fromEntries(
      actions
      .map(
        (action: string): [string, ResourcePageRouteOptions] => {
          const page = (configured[action] || {}) as ResourcePageRouteOptions;

          return [action, {
            member: false,
            ...(defaultPages[action] || {}),
            ...page,
          }];
        }
      )
    );

  return (
    <Route path={path}>
      {
        generateCollectionRoutes({
          Pages,
          pages: filterPages(options, isCollectionPage)
        })
      }

      {
        generateMemberRoutes({
          Pages,
          pages: filterPages(options, isMemberPage),
          resourceName,
          singularName,
        })
      }
    </Route>
  );
};
