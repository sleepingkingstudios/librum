import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceShowPage } from './index';
import {
  responseWithData,
  responseWithStatus,
} from '@api';
import {
  generateAlerts,
  useResourceQuery,
} from '@resources/api';
import type { ResourcePageOptions } from '@resources/components/page';
import { ConfiguredDataBlock } from '@resources/types';
import { render } from '@test-helpers/rendering';
import { MockBlock as Block } from './mocks';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@resources/api', () => require('@resources/api/mocks'));
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock(
  '@components/page/breadcrumbs',
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
  () => require('@components/page/breadcrumbs/mocks'),
);

const mockUseResourceQuery = useResourceQuery as jest.MockedFunction<
  typeof useResourceQuery
>;

describe('<ResourceShowPage />', () => {
  const action = 'show';
  const page: ResourcePageOptions = { member: true };
  const resourceName = 'rareBooks';
  const renderShowPage = ({
    Block,
    singularName,
  }: {
    Block?: ConfiguredDataBlock,
    singularName?: string,
  }) => {
    return render(
      <ResourceShowPage
        Block={Block}
        action={action}
        page={page}
        resourceName={resourceName}
        singularName={singularName}
      />,
      {
        router: {
          initialEntries: ['/rareBooks/gideon-9'],
          path: '/rareBooks/:rareBookId',
        },
        store: true,
      },
    );
  };
  const refetch = jest.fn();
  const response = responseWithStatus({ status: 'uninitialized' });

  beforeEach(() => {
    mockUseResourceQuery
      .mockClear()
      .mockImplementation(() => [response, refetch]);
  });

  it('should configure the request', () => {
    const alerts = generateAlerts({
      action: 'show',
      member: true,
      query: true,
      resourceName,
    });
    const expected = {
      action,
      alerts,
      member: true,
      resourceName,
      url: '',
      wildcards: { rareBookId: 'gideon-9' },
    };

    renderShowPage({});

    expect(useResourceQuery).toHaveBeenCalledWith(expected);
  });

  it('should display the breadcrumbs', () => {
    const { getAllByRole } = renderShowPage({});
    const expected = [
      'Home @ /',
      'Rare Books @ /rare-books',
      'Loading (active)',
    ];

    const rendered = getAllByRole('listitem');

    expect(rendered).toHaveLength(3);
    expect(rendered.map(item => item.textContent)).toEqual(expected);
  });

  it('should display the contents', () => {
    const { getByText } = renderShowPage({});

    const contents = getByText('Missing <Block /> Component');
    expect(contents).toBeVisible();
  });

  it('should display the heading', () => {
    const { getByRole } = renderShowPage({});

    const heading = getByRole('heading', { level: 1 });

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent('Loading Rare Book');
  });

  it('should match the snapshot', () => {
    const { asFragment } = renderShowPage({});

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the query returns a failing response', () => {
    const response = responseWithStatus({ status: 'failure' });

    beforeEach(() => {
      mockUseResourceQuery.mockImplementation(() => [response, refetch]);
    });

    it('should display the contents', () => {
      const { getByText } = renderShowPage({});

      const contents = getByText('Missing <Block /> Component');
      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderShowPage({});

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the query returns a loading response', () => {
    const response = responseWithStatus({ status: 'loading' });

    beforeEach(() => {
      mockUseResourceQuery.mockImplementation(() => [response, refetch]);
    });

    it('should display the loading message', () => {
      const { getByText } = renderShowPage({});

      const contents = getByText('Loading Rare Book...');
      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderShowPage({});

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the query returns a successful response', () => {
    const response = responseWithStatus({ status: 'success' });

    beforeEach(() => {
      mockUseResourceQuery.mockImplementation(() => [response, refetch]);
    });

    it('should display the contents', () => {
      const { getByText } = renderShowPage({});

      const contents = getByText('Missing <Block /> Component');
      expect(contents).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderShowPage({});

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with Block: value', () => {
    it('should display the contents', () => {
      const expectedTerms = ['Name', 'Slug', 'Author'];
      const expectedDfns  = ['Unknown Book', 'unknown-book', 'Unknown Author'];
      const { getAllByRole } = renderShowPage({ Block });

      const terms = getAllByRole('term');
      const dfns = getAllByRole('definition');

      expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
      expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderShowPage({ Block });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the query returns a failing response', () => {
      const response = responseWithStatus({ status: 'failure' });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the contents', () => {
        const expectedTerms = ['Name', 'Slug', 'Author'];
        const expectedDfns  =
          ['Unknown Book', 'unknown-book', 'Unknown Author'];
        const { getAllByRole } = renderShowPage({ Block });

        const terms = getAllByRole('term');
        const dfns = getAllByRole('definition');

        expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
        expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderShowPage({ Block });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the query returns a loading response', () => {
      const response = responseWithStatus({ status: 'loading' });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the loading message', () => {
        const { getByText } = renderShowPage({});

        const contents = getByText('Loading Rare Book...');
        expect(contents).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderShowPage({});

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the query returns a successful response', () => {
      const response = responseWithStatus({ status: 'success' });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the contents', () => {
        const expectedTerms = ['Name', 'Slug', 'Author'];
        const expectedDfns  =
          ['Unknown Book', 'unknown-book', 'Unknown Author'];
        const { getAllByRole } = renderShowPage({ Block });

        const terms = getAllByRole('term');
        const dfns = getAllByRole('definition');

        expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
        expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderShowPage({ Block });

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the query returns a successful response with data', () => {
      const data = {
        rareBook: {
          name: 'Gideon the Ninth',
          slug: 'gideon-9',
          author: 'Tammsyn Muir',
        },
      };
      const response = responseWithData({ data });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the contents', () => {
        const expectedTerms = ['Name', 'Slug', 'Author'];
        const expectedDfns  =
          ['Gideon the Ninth', 'gideon-9', 'Tammsyn Muir'];
        const { getAllByRole } = renderShowPage({ Block });

        const terms = getAllByRole('term');
        const dfns = getAllByRole('definition');

        expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
        expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderShowPage({ Block });

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with singularName: value', () => {
    const singularName = 'rareTome';

    it('should configure the request', () => {
      const alerts = generateAlerts({
        action: 'show',
        member: true,
        query: true,
        resourceName,
        singularName,
      });
      const expected = {
        action,
        alerts,
        member: true,
        resourceName,
        singularName,
        url: '',
        wildcards: { rareBookId: 'gideon-9' },
      };

      renderShowPage({ singularName });

      expect(useResourceQuery).toHaveBeenCalledWith(expected);
    });

    it('should display the breadcrumbs', () => {
      const { getAllByRole } = renderShowPage({ singularName });
      const expected = [
        'Home @ /',
        'Rare Books @ /rare-books',
        'Loading (active)',
      ];

      const rendered = getAllByRole('listitem');

      expect(rendered).toHaveLength(3);
      expect(rendered.map(item => item.textContent)).toEqual(expected);
    });

    it('should display the contents', () => {
      const { getByText } = renderShowPage({ singularName });

      const contents = getByText('Missing <Block /> Component');
      expect(contents).toBeVisible();
    });

    it('should display the heading', () => {
      const { getByRole } = renderShowPage({ singularName });

      const heading = getByRole('heading', { level: 1 });

      expect(heading).toBeVisible();
      expect(heading).toHaveTextContent('Loading Rare Tome');
    });

    it('should match the snapshot', () => {
      const { asFragment } = renderShowPage({ singularName });

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the query returns a loading response', () => {
      const response = responseWithStatus({ status: 'loading' });

      beforeEach(() => {
        mockUseResourceQuery.mockImplementation(() => [response, refetch]);
      });

      it('should display the loading message', () => {
        const { getByText } = renderShowPage({ singularName });

        const contents = getByText('Loading Rare Tome...');
        expect(contents).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = renderShowPage({ singularName });

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
