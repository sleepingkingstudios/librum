import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useTheme } from './index';
import { defaultTheme } from './context';
import { chiaroscuro } from './chiaroscuro';
import { ThemeProvider } from './provider';

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
    it('should display the provided theme', () => {
      const expected = JSON.stringify(chiaroscuro);

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      expect(screen.getByText(/Theme:/)).toHaveTextContent(expected);
    });
  });
});
