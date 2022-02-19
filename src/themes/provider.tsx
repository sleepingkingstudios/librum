import * as React from 'react';

import { chiaroscuro } from './chiaroscuro';
import { ThemeContext } from './context';
import { Theme } from './theme';

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
