import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { PublisherBlock } from './block';
import { publishers } from '../test-helpers';

describe('<PublisherBlock />', () => {
  describe('when there is no matching data', () => {
    const data = {};

    it('should render the empty block', () => {
      const expectedTerms = ['Name', 'Slug', 'Website'];
      const expectedDfns  = [' ', ' ', ' '];
      const { getAllByRole } = render(
        <PublisherBlock data={data} />,
        { router: true },
      );

      const terms = getAllByRole('term');
      const dfns = getAllByRole('definition');

      expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
      expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
    });

    it('should render the publishers link', () => {
      const { getByRole } = render(
        <PublisherBlock data={data} />,
        { router: true },
      );
      const link = getByRole('link', { name: 'Back to Publishers' });

      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', '/publishers');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PublisherBlock data={data} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there is publisher data', () => {
    const data = { publisher: publishers[0] };

    it('should render the publisher block', () => {
      const expectedTerms = ['Name', 'Slug', 'Website'];
      const expectedDfns = [
        'Crystal Sphere Publications',
        'crystal-sphere-publications',
        'www.example.com/crystal-sphere-publications',
      ];
      const { getAllByRole } = render(
        <PublisherBlock data={data} />,
        { router: true },
      );

      const terms = getAllByRole('term');
      const dfns = getAllByRole('definition');

      expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
      expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
    });

    it('should render the website link', () => {
      const { getByRole } = render(
        <PublisherBlock data={data} />,
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

    it('should render the publishers link', () => {
      const { getByRole } = render(
        <PublisherBlock data={data} />,
        { router: true },
      );
      const link = getByRole('link', { name: 'Back to Publishers' });

      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', '/publishers');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PublisherBlock data={data} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
