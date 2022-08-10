import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  ThemeContext,
  defaultTheme,
} from './context';
import { useTheme } from './index';
import type { Theme } from './types';

const ThemeDisplay = (): JSX.Element => {
  const theme = useTheme();

  return (
    <div>
      Theme: { JSON.stringify(theme) }
    </div>
  );
};

describe('useTheme()', () => {
  it('should display the default theme', () => {
    const expected = JSON.stringify(defaultTheme);

    render(<ThemeDisplay />);

    expect(screen.getByText(/Theme:/)).toHaveTextContent(expected);
  });

  describe('with a provider', () => {
    const theme: Theme = {
      className: 'theme-custom',
      name: 'custom-theme',
    };

    it('should display the provided theme', () => {
      const expected = JSON.stringify(theme);

      render(
        <ThemeContext.Provider value={theme}>
          <ThemeDisplay />
        </ThemeContext.Provider>
      );

      expect(screen.getByText(/Theme:/)).toHaveTextContent(expected);
    });
  });
});
