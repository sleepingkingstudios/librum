import * as React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { ApplicationRoutes } from './index';

const renderAt = (element: React.ReactNode, path: string) => (
  render(
    <MemoryRouter initialEntries={[path]}>
      { element }
    </MemoryRouter>
  )
);

describe('<ApplicationRoutes>', () => {
  describe('with path "/"', () => {
    it('should render the home page', () => {
      renderAt(<ApplicationRoutes />, '/');

      const text = screen.getByText(/At twilight's end, the shadows cross'd/);

      expect(text).toBeVisible();
    });
  });

  describe('with path "/invalid"', () => {
    it('should render the not found page', () => {
      renderAt(<ApplicationRoutes />, '/invalid');

      const text = screen.getByText(/No more tales worth telling/);

      expect(text).toBeVisible();
    });
  });

  describe('with path "/invalid/path/to/page"', () => {
    it('should render the not found page', () => {
      renderAt(<ApplicationRoutes />, '/invalid/path/to/page');

      const text = screen.getByText(/No more tales worth telling/);

      expect(text).toBeVisible();
    });
  });
});
