import * as React from 'react';
import { pick } from 'lodash';

import { ResourcePage } from '@resources/components/page';
import type { ResourcePageOptions } from '@resources/components/page';
import { upperCamelCase } from '@utils/text';
import { ResourceIndexPage } from './index-page';
import { ResourceShowPage } from './show-page';
import type {
  ResourceConfiguration,
  ResourcePageComponent,
  ResourcePagesConfiguration,
} from '../types';

type DefaultPage = {
  Page: ResourcePageComponent,
  member: boolean,
};

type GeneratePage = {
  action: string,
  defaultPage: DefaultPage,
  maybePage: PageConfiguration,
} & ResourceConfiguration;

type GenerateResourcePages = {
  pages?: ResourcePagesConfiguration,
} & ResourceConfiguration;

type MaybePageConfiguration = false | PageConfiguration;

type PageConfiguration = ResourcePageOptions | React.ComponentType;

const defaultPages: Record<string, DefaultPage> = {
  index: {
    Page: ResourceIndexPage,
    member: false,
  },
  show: {
    Page: ResourceShowPage,
    member: true,
  },
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

  if (defaultPage) {
    const { Page, ...pageDefaults } = defaultPage;
    const page = {
      ...resourceDefaults,
      ...pageDefaults,
      ...(maybePage as ResourcePageOptions),
    };
    const PageWithDefaults = (): JSX.Element => (<Page {...config} page={page} />);

    return PageWithDefaults;
  }

  const page: ResourcePageOptions = {
    ...resourceDefaults,
    ...(maybePage as ResourcePageOptions),
  };

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
    ...{
      index: true,
      show: true
    },
    ...configured,
  });
  const generated: Record<string, React.ComponentType> = {};

  actions.forEach((action): void => {
    if (configured[action] === false) { return; }

    const key = `${upperCamelCase(action)}Page`;
    const defaultPage: DefaultPage = defaultPages[action];
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
