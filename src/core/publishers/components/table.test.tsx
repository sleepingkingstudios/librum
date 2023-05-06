import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { PublishersTable } from './table';
import { publishers } from '../test-helpers';

describe('<PublishersTable />', () => {
  const expectedHeader = [
    'Name',
    'Website',
    ' ',
  ];

  describe('when there is no matching data', () => {
    const data = {};
    const expectedMessage = 'There are no matching publishers.';

    it('should render the header cells', () => {
      const { getAllByRole } = render(<PublishersTable data={data} />);
      const cells = getAllByRole('columnheader');

      expect(cells).toHaveLength(3);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
    });

    it('should display the empty message', () => {
      const { getByRole } = render(<PublishersTable data={data} />);
      const cell = getByRole('cell');

      expect(cell.textContent).toBe(expectedMessage);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<PublishersTable data={data} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there are many rows', () => {
    const data = { publishers };
    const expectedBody = [
      'Crystal Sphere Publications',
      'www.example.com/crystal-sphere-publications',
      ' ',
      'Flumph Free Press',
      'www.example.com/flumph-free-press',
      ' ',
      'Spelljammer Monthly',
      'www.example.com/spelljammer-monthly',
      ' ',
    ];

    it('should render the header cells', () => {
      const { getAllByRole } = render(
        <PublishersTable data={data} />,
        { router: true },
      );
      const cells = getAllByRole('columnheader');

      expect(cells).toHaveLength(3);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
    });

    it('should display the formatted data', () => {
      const { getAllByRole } = render(
        <PublishersTable data={data} />,
        { router: true },
      );
      const cells = getAllByRole('cell');

      expect(cells).toHaveLength(9);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedBody);
    });

    it('should render the name links', () => {
      const { getByRole } = render(
        <PublishersTable data={data} />,
        { router: true },
      );

      const link = getByRole('link', { name: 'Crystal Sphere Publications' });
      expect(link).toBeVisible();
      expect(link).toHaveAttribute(
        'href',
        '/publishers/crystal-sphere-publications',
      );
    });

    it('should render the website links', () => {
      const { getByRole } = render(
        <PublishersTable data={data} />,
        { router: true },
      );

      const link = getByRole(
        'link',
        { name: 'www.example.com/crystal-sphere-publications' },
      );
      expect(link).toBeVisible();
      expect(link).toHaveAttribute(
        'href',
        'https://www.example.com/crystal-sphere-publications',
      );
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PublishersTable data={data} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
