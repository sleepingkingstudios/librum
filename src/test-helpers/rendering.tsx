import * as React from 'react';

import { MemoryRouter } from 'react-router-dom';
import {
  RenderOptions,
  RenderResult,
  render,
} from '@testing-library/react';

import { ThemeContext } from '@themes/context';
import { defaultTheme } from '@themes/theme';

interface themeProperties {
  [index: string]: string;
}

interface customRenderOptions extends RenderOptions {
  initialEntries?: Array<string>;
  router?: true;
  theme?: themeProperties;
}

interface withRouterOptions {
  initialEntries?: Array<string>;
}

interface withThemeOptions {
  theme: themeProperties;
}

export const withRouter = (
  component: React.ReactElement,
  { initialEntries = ['/'] }: withRouterOptions,
): React.ReactElement => (
  <MemoryRouter initialEntries={initialEntries}>
    { component }
  </MemoryRouter>
);

export const withTheme = (
  component: React.ReactElement,
  { theme }: withThemeOptions
): React.ReactElement => (
  <ThemeContext.Provider value={{ ...defaultTheme, ...theme }}>
    { component }
  </ThemeContext.Provider>
);

const customRender = (
  component: React.ReactElement,
  options?: customRenderOptions
): RenderResult => {
  if (!options) { return render(component); }

  let wrapped: React.ReactElement = component;

  if ('router' in options && options.router) {
    wrapped = withRouter(wrapped, { initialEntries: options.initialEntries });
  }

  if ('theme' in options) {
    wrapped = withTheme(wrapped, { theme: options.theme });
  }

  return render(wrapped, options);
};

export { customRender as render };
