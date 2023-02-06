import * as React from 'react';

import { ThemeContext } from './context';
import { chiaroscuro } from './chiaroscuro';

export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode,
}): JSX.Element => (
  <ThemeContext.Provider value={chiaroscuro}>
    { children }
  </ThemeContext.Provider>
);
