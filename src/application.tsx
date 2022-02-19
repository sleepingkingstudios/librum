import * as React from 'react';
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from '@themes';
import { ApplicationRoutes } from './routes';

export const Application = (): JSX.Element => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ApplicationRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
