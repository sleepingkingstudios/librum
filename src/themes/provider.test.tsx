import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { chiaroscuro } from './chiaroscuro';
import { ThemeContext } from './context';
import { ThemeProvider } from './provider';

const ThemeDisplay = (): JSX.Element => {
  const theme = React.useContext(ThemeContext);

  return (
    <div>
      Theme: { JSON.stringify(theme) }
    </div>
  );
};

describe('<ThemeProvider>', () => {
  it('should display the default theme', () => {
    const expected = JSON.stringify(chiaroscuro);

    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );

    expect(screen.getByText(/Theme:/)).toHaveTextContent(expected);
  });
});
