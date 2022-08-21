import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

import { AlertsProvider } from '@alerts';
import { ThemeProvider } from '@themes';
import { ApplicationRoutes } from './routes';
import { store } from '@store';

export const Application = (): JSX.Element => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AlertsProvider>
            <ApplicationRoutes />
          </AlertsProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  );
};
