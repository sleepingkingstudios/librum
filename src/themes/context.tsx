import * as React from 'react';

import type { Theme } from './types';

export const defaultTheme: Theme = { name: 'default' };

export const ThemeContext = React.createContext(defaultTheme);
