import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {
  RenderOptions,
  RenderResult,
  render,
} from '@testing-library/react';

import {
  createStore,
  storeType,
} from './store';
import {
  ThemeContext,
  defaultTheme,
} from '@themes/context';
import type { Theme } from '@themes';

interface customRenderOptions extends RenderOptions {
  initialEntries?: Array<string>;
  router?: true;
  store?: (storeType | true);
  theme?: (Theme | true);
}

interface withRouterOptions {
  initialEntries?: Array<string>;
}

export const withRouter = (
  component: React.ReactElement,
  { initialEntries = ['/'] }: withRouterOptions,
): React.ReactElement => (
  <MemoryRouter initialEntries={initialEntries}>
    { component }
  </MemoryRouter>
);

export const withStore = (
  component: React.ReactElement,
  { store }: { store: (storeType | true) }
): React.ReactElement => {
  let configuredStore: storeType;

  if (store === true) {
    configuredStore = createStore().store;
  } else {
    configuredStore = store;
  }

  return (
    <ReduxProvider store={configuredStore}>
      { component }
    </ReduxProvider>
  );
};

export const withTheme = (
  component: React.ReactElement,
  { theme }: { theme: (Theme | true) }
): React.ReactElement => {
  let configuredTheme: Theme;

  if (theme === true) {
    configuredTheme = defaultTheme;
  } else {
    configuredTheme = theme;
  }

  return (
    <ThemeContext.Provider value={configuredTheme}>
      { component }
    </ThemeContext.Provider>
  );
};

const customRender = (
  component: React.ReactElement,
  options?: customRenderOptions
): RenderResult => {
  let wrapped: React.ReactElement = (
    <React.StrictMode>{ component }</React.StrictMode>
  );

  if (!options) { return render(wrapped); }

  if ('router' in options && options.router) {
    wrapped = withRouter(wrapped, { initialEntries: options.initialEntries });
  }

  if ('store' in options) {
    wrapped = withStore(wrapped, { store: options.store });
  }

  if ('theme' in options) {
    wrapped = withTheme(wrapped, { theme: options.theme });
  }

  return render(wrapped, options);
};

export { customRender as render };
