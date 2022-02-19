import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ThemeContext } from './context';
import { defaultTheme } from './theme';

const ThemeDisplay = (): JSX.Element => {
  const theme = React.useContext(ThemeContext);

  return (
    <div>
      Theme: { JSON.stringify(theme) }
    </div>
  );
};

describe('<ThemeContext>', () => {
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
