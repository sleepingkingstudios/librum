import * as React from 'react';

import { ThemeContext } from './context';
import { chiaroscuro } from './chiaroscuro';
import type { Theme } from './types';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider =
  ({ children }: ThemeProviderProps): JSX.Element => {
    const theme: Theme = chiaroscuro;

    return (
      <ThemeContext.Provider value={theme}>
        { children }
      </ThemeContext.Provider>
    );
  }
