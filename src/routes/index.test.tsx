import * as React from 'react';

import '@testing-library/jest-dom';

import { ApplicationRoutes } from './index';
import { HomePage } from '../home';
import { LoginPage } from '../pages';
import { NotFoundPage } from '../not-found';
import { shouldRenderContent } from '@test-helpers/routing';

jest.mock('../home');
jest.mock('../pages');
jest.mock('../not-found');

const mockHomePage = HomePage as jest.MockedFunction<typeof HomePage>;
const mockLoginPage = LoginPage as jest.MockedFunction<typeof LoginPage>;
const mockNotFoundPage = NotFoundPage as jest.MockedFunction<typeof NotFoundPage>;

mockHomePage.mockImplementation(() => (<div id="page">Home Page</div>));
mockLoginPage.mockImplementation(() => (<div id="page">Login Page</div>));
mockNotFoundPage.mockImplementation(() => (<div id="page">Not Found Page</div>));

describe('<ApplicationRoutes>', () => {
  shouldRenderContent(
    ApplicationRoutes,
    { content: 'Home Page', at: '/' },
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
});
