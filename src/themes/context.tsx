import * as React from 'react';

import type { Theme } from './types';

export const defaultTheme: Theme = {
  className: 'theme-default',
  name: 'default',
};

export const ThemeContext = React.createContext(defaultTheme);
