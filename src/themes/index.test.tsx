import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ThemeContext } from './context';
import {
  useTheme,
  useThemeStyles,
} from './index';
import { defaultTheme } from './theme';

const ThemeDisplay = (): JSX.Element => {
  const theme = useTheme();

  return (
    <div>
      Theme: { JSON.stringify(theme) }
    </div>
  );
};

const ThemeStyles = (): JSX.Element => (
  <div>
    Styles: { useThemeStyles('text-accent') }
  </div>
);

describe('useTheme()', () => {
  it('should display the default theme', () => {
    const expected = JSON.stringify(defaultTheme);

    render(<ThemeDisplay />);

    expect(screen.getByText(/Theme:/)).toHaveTextContent(expected);
  });

  describe('with a provider', () => {
    const theme = { ...defaultTheme, name: 'Custom Theme' };

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

describe('useThemeStyles()', () => {
  it('should generate the className', () => {
    render(<ThemeStyles />);

    expect(screen.getByText(/Styles:/)).toHaveTextContent(/^Styles:$/);
  });

  describe('with a provider', () => {
    const theme = {
      ...defaultTheme,
      name: 'Custom Theme',
      textAccent: '@textBase font-mono',
      textBase: 'text-[#ff3366]',
    };

    it('should generate the className', () => {
      const expected = 'text-[#ff3366] font-mono';

      render(
        <ThemeContext.Provider value={theme}>
          <ThemeStyles />
        </ThemeContext.Provider>
      );

      expect(screen.getByText(/Styles:/)).toHaveTextContent(expected);
    });
  });
});
