import * as React from 'react';

import { ThemeContext } from './context';

export { ThemeProvider } from './provider';
export type { Theme } from './types';

import './styles/theme.css';

export const useTheme = () => React.useContext(ThemeContext);
