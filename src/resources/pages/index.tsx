import * as React from 'react';
import { pick } from 'lodash';

import type { ResourceApiHooks } from '@resources/api/types';
import { ResourcePage } from '@resources/components/page';
import type { ResourcePageOptions } from '@resources/components/page';
import { isComponent } from '@utils/react-utils';
import { upperCamelCase } from '@utils/text';
import { ResourceIndexPage } from './index-page';
import type {
  ResourceConfiguration,
  ResourcePageComponent,
  ResourcePagesConfiguration,
} from '../types';

type GeneratePage = {
  action: string,
  apiHooks: ResourceApiHooks,
  defaultPage: React.ComponentType,
  maybePage: PageConfiguration,
} & ResourceConfiguration;

type GenerateResourcePages = {
  apiHooks: ResourceApiHooks,
  pages?: ResourcePagesConfiguration,
} & ResourceConfiguration;

type MaybePageConfiguration = false | PageConfiguration;

type PageConfiguration = ResourcePageOptions | React.ComponentType;

const defaultPages: Record<string, React.ComponentType> = {
  index: ResourceIndexPage,
};

const generatePage = ({
  defaultPage,
  maybePage,
  ...config
}: GeneratePage): React.ComponentType => {
  const resourceDefaults: ResourcePageOptions =
    pick(config, ['navigation', 'subtitle', 'title']);

  if ('Page' in maybePage) {
    const ConfiguredPage = maybePage.Page as ResourcePageComponent;
    const Page = (): JSX.Element => (
      <ConfiguredPage {...config} page={resourceDefaults} />
    );

    return Page;
  }

  const page: ResourcePageOptions = {
    ...resourceDefaults,
    ...(maybePage as ResourcePageOptions),
  };

  if (isComponent(defaultPage)) {
    const DefaultPage = defaultPage as ResourcePageComponent;
    const Page = (): JSX.Element => (<DefaultPage {...config} page={page} />);

    return Page;
  }

  const Page = (): JSX.Element => (
    <ResourcePage {...config} page={page} />
  );

  return Page;
};

export const generateResourcePages = ({
  pages,
  ...config
}: GenerateResourcePages): Record<string, React.ComponentType> => {
  const configured: ResourcePagesConfiguration = pages || {};
  const actions = Object.keys({
    ...{ index: true },
    ...configured,
  });
  const generated: Record<string, React.ComponentType> = {};

  actions.forEach((action): void => {
    if (configured[action] === false) { return; }

    const key = `${upperCamelCase(action)}Page`;
    const defaultPage: React.ComponentType = defaultPages[action];
    const maybePage: MaybePageConfiguration = configured[action] || {};

    generated[key] = generatePage({
      action,
      defaultPage,
      maybePage,
      ...config
    });
  });

  return generated;
};
