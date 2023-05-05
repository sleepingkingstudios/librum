import * as React from 'react';

import '@testing-library/jest-dom';
import {
  Routes,
  useParams,
} from 'react-router-dom';

import { generateResourceRoutes } from './index';
import {
  shouldNotRenderRoute,
  shouldRenderRoute,
} from '@test-helpers/routing';
import type {
  ResourceConfiguration,
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
  const shouldRenderStandardRoutes = ({
    Pages,
    baseUrl = '/rare-books',
    index = true,
    resource,
    show = true,
  }: {
    Pages: Record<string, ResourcePageComponent>,
    baseUrl?: string,
    index?: boolean,
    resource: ResourceConfiguration,
    show?: boolean,
  }) => {
    const Routes = buildRoutes({ Pages, ...resource });

    if (index) {
      shouldRenderRoute(Routes, {
        at: baseUrl,
        content: 'Index Page',
      });
    } else {
      shouldNotRenderRoute(Routes, {
        at: baseUrl,
      });
    }

    if (show) {
      shouldRenderRoute(Routes, {
        at: `${baseUrl}/gideon-9`,
        content: 'Show Page @ gideon-9',
      });
    } else {
      shouldNotRenderRoute(Routes, {
        at: `${baseUrl}/gideon-9`,
      });
    }
  };

  const IndexPage = () => (<span>Index Page</span>);
  const ShowPage = () => {
    const params = useParams();
    const { rareBookId } = params;

    return (
      <span>{ `Show Page @ ${rareBookId}` }</span>
    );
  };
  const Pages: Record<string, ResourcePageComponent> = {
    IndexPage,
    ShowPage,
  };
  const resourceName = 'rareBooks';
  const resource = { resourceName };

  shouldRenderStandardRoutes({ Pages, resource });

  describe('with pages: { index: false }', () => {
    const pages: ResourcePagesConfiguration = { index: false };
    const resource = { pages, resourceName };

    shouldRenderStandardRoutes({ Pages, resource, index: false });
  });

  describe('with pages: { show: false }', () => {
    const pages: ResourcePagesConfiguration = { show: false };
    const resource = { pages, resourceName };

    shouldRenderStandardRoutes({ Pages, resource, show: false });
  });

  describe('with scope: value', () => {
    const scope = 'lendingLibrary';
    const resource = { resourceName, scope };

    shouldRenderStandardRoutes({
      Pages,
      baseUrl: '/lending-library/rare-books',
      resource,
    });
  });

  describe('with extra pages', () => {
    const PublishPage = () => {
      const params = useParams();
      const { rareBookId } = params;

      return (
        <span>{ `Publish Page @ ${rareBookId}` }</span>
      );
    };
    const PublishedPage = () => (<span>Published Page</span>);
    const Pages: Record<string, ResourcePageComponent> = {
      IndexPage,
      PublishPage,
      PublishedPage,
      ShowPage,
    };
    const pages = {
      publish: { member: true },
      published: { member: false },
    };
    const resource = { pages, resourceName };

    shouldRenderStandardRoutes({ Pages, resource });

    shouldRenderRoute(buildRoutes({ Pages, ...resource }), {
      at: '/rare-books/published',
      content: 'Published Page',
    });

    shouldRenderRoute(buildRoutes({ Pages, ...resource }), {
      at: '/rare-books/gideon-9/publish',
      content: 'Publish Page @ gideon-9',
    });
  });
});
