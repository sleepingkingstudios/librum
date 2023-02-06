import * as React from 'react';

import '@testing-library/jest-dom';
import { Route } from 'react-router-dom';

import { ApplicationRoutes } from './index';
import { shouldRenderAuthenticatedRoute } from '@test-helpers/routing';

jest.mock('@core/publishers', () => ({
  routes: () => (
    <Route
      path="/publishers"
      element={<div id="page">Publishers Routes</div>}
    />
  )
}));
jest.mock('@pages', () => ({
  DemoPage: () => (<div id="page">Demo Page</div>),
  HomePage: () => (<div id="page">Home Page</div>),
  LoginPage: () => (<div id="page">Login Page</div>),
  NotFoundPage: () => (<div id="page">Not Found Page</div>),
  UserPage: () => (<div id="page">User Page</div>),
}));

describe('<ApplicationRoutes>', () => {
  shouldRenderAuthenticatedRoute(
    ApplicationRoutes,
    { content: 'Home Page', at: '/' },
  );

  shouldRenderAuthenticatedRoute(
    ApplicationRoutes,
    { content: 'Demo Page', at: '/demo' },
  );

  shouldRenderAuthenticatedRoute(
    ApplicationRoutes,
    { content: 'Not Found Page', at: '/invalid' },
  );

  shouldRenderAuthenticatedRoute(
    ApplicationRoutes,
    {
      content: 'Not Found Page',
      at: '/invalid/path/to/page',
    },
  );

  shouldRenderAuthenticatedRoute(
    ApplicationRoutes,
    { content: 'User Page', at: '/user' },
  );

  shouldRenderAuthenticatedRoute(
    ApplicationRoutes,
    { content: 'Publishers Routes', at: '/publishers' },
  );
});
