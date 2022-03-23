import * as React from 'react';

import { ThemeContext } from './context';

export { ThemeProvider } from './provider';
export { Theme } from './theme';

import './theme.css';

export const useTheme = () => React.useContext(ThemeContext);
