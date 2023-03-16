import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import {
  MemoryRouter,
  Routes,
  Route
} from "react-router-dom";
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
  router?: true | withRouterOptions;
  store?: (storeType | true);
  theme?: (Theme | true);
}

interface withRouterOptions {
  initialEntries?: Array<string>;
  path?: string;
}

export const withRouter = (
  component: React.ReactElement,
  {
    initialEntries = ['/'],
    path,
  }: withRouterOptions,
): React.ReactElement => {
  let wrapped = component;

  if (path) {
    wrapped = (
      <Routes>
        <Route path={path} element={wrapped} />
      </Routes>
    );
  }

  return (
    <MemoryRouter initialEntries={initialEntries}>
      { wrapped }
    </MemoryRouter>
  );
};

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
  options?: customRenderOptions,
  strictMode = true,
): RenderResult => {
  let wrapped: React.ReactElement = component;

  if (strictMode) {
    wrapped = (<React.StrictMode>{ wrapped }</React.StrictMode>);
  }

  if (!options) { return render(wrapped); }

  if ('router' in options && options.router) {
    if (options.router === true) {
      wrapped = withRouter(wrapped, { initialEntries: options.initialEntries });
    } else {
      wrapped = withRouter(
        wrapped,
        {
          initialEntries: options.initialEntries,
          ...options.router,
        },
      );
    }
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
