import * as React from 'react';

import '@testing-library/jest-dom';

import { ApplicationRoutes } from './index';
import {
  DemoPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  UserPage,
} from '../pages';
import { shouldRenderContent } from '@test-helpers/routing';

jest.mock('../pages');

const mockDemoPage = DemoPage as jest.MockedFunction<typeof DemoPage>;
const mockHomePage = HomePage as jest.MockedFunction<typeof HomePage>;
const mockLoginPage = LoginPage as jest.MockedFunction<typeof LoginPage>;
const mockNotFoundPage = NotFoundPage as jest.MockedFunction<typeof NotFoundPage>;
const mockUserPage = UserPage as jest.MockedFunction<typeof UserPage>;

mockDemoPage.mockImplementation(() => (<div id="page">Demo Page</div>))
mockHomePage.mockImplementation(() => (<div id="page">Home Page</div>));
mockLoginPage.mockImplementation(() => (<div id="page">Login Page</div>));
mockNotFoundPage.mockImplementation(() => (<div id="page">Not Found Page</div>));
mockUserPage.mockImplementation(() => (<div id="page">User Page</div>));

describe('<ApplicationRoutes>', () => {
  shouldRenderContent(
    ApplicationRoutes,
    { content: 'Home Page', at: '/' },
  );

  shouldRenderContent(
    ApplicationRoutes,
    { content: 'Demo Page', at: '/demo' },
  );

  shouldRenderContent(
    ApplicationRoutes,
    { content: 'Not Found Page', at: '/invalid' },
  );

  shouldRenderContent(
    ApplicationRoutes,
    {
      content: 'Not Found Page',
      at: '/invalid/path/to/page',
    },
  );

  shouldRenderContent(
    ApplicationRoutes,
    { content: 'User Page', at: '/user' },
  );
});
