import * as React from 'react';

import '@testing-library/jest-dom';
import { Routes } from 'react-router-dom';

import { generateResourceRoutes } from './index';
import {
  shouldNotRenderRoute,
  shouldRenderRoute,
} from '@test-helpers/routing';
import type {
  ResourcePageComponent,
  ResourcePagesConfiguration,
  ResourceRoutesProps,
} from '../types';

describe('<ResourcesRoutes />', () => {
  const buildRoutes = ({
    Pages,
    ...resource
  // eslint-disable-next-line react/display-name
  }: ResourceRoutesProps) => (): JSX.Element => (
    <Routes>
      {
        generateResourceRoutes({
          Pages,
          ...resource
        })
      }
    </Routes>
  );

  const Pages: Record<string, ResourcePageComponent> = {
    IndexPage: () => (<span>Index Page</span>),
  };
  const resourceName = 'rareBooks';
  const resource = { resourceName };

  shouldRenderRoute(buildRoutes({ Pages, ...resource }), {
    at: '/rare-books',
    content: 'Index Page',
  });

  describe('with pages: { index: false }', () => {
    const pages: ResourcePagesConfiguration = { index: false };
    const resource = { pages, resourceName };

    shouldNotRenderRoute(buildRoutes({ Pages, ...resource }), {
      at: '/rare-books',
    });
  });

  describe('with scope: value', () => {
    const scope = 'lendingLibrary';
    const resource = { resourceName, scope };

    shouldRenderRoute(buildRoutes({ Pages, ...resource }), {
      at: '/lending-library/rare-books',
      content: 'Index Page',
    });
  });

  describe('with extra pages', () => {
    const Pages: Record<string, ResourcePageComponent> = {
      IndexPage: () => (<span>Index Page</span>),
      PublishPage: () => (<span>Publish Page</span>),
      PublishedPage: () => (<span>Published Page</span>),
    };
    const pages = {
      publish: { member: true },
      published: { member: false },
    };
    const resource = { pages, resourceName };

    shouldRenderRoute(buildRoutes({ Pages, ...resource }), {
      at: '/rare-books',
      content: 'Index Page',
    });

    shouldRenderRoute(buildRoutes({ Pages, ...resource }), {
      at: '/rare-books/published',
      content: 'Published Page',
    });

    shouldRenderRoute(buildRoutes({ Pages, ...resource }), {
      at: '/rare-books/on-war/publish',
      content: 'Publish Page',
    });
  });
});
