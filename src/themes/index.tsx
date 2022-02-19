import * as React from 'react';

import { ThemeContext } from './context';
import { applyTheme } from './utils';

export { ThemeProvider } from './provider';
export { Theme } from './theme';

export const useTheme = () => React.useContext(ThemeContext);

export const useThemeStyles = (...config: Array<string>): string => {
  const theme = useTheme();

  return applyTheme({ config, theme });
};
