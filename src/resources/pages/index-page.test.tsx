import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceIndexPage } from './index-page';
import {
  defaultResult,
  failureResult,
  loadingResult,
  successResult,
} from '@api/test-helpers';
import type { DataTableData } from '@components/data-table';
import type { Breadcrumbs } from '@components/page';
import { PageNavigation } from '@components/page/navigation/mocks';
import { render } from '@test-helpers/rendering';

jest.mock('@components/page', () => require('@components/page/mocks'));

const MockTable = ({ data }: { data: DataTableData }): JSX.Element => {
  const books = 'rareBooks' in data ? data.rareBooks : [];

  return (
    <span className="mock-data-table">
      { `There are ${books.length} books!` }
    </span>
  );
};

describe('<ResourceIndexPage />', () => {
  const resourceName = 'rareBooks';
  const useQuery = jest.fn(() => defaultResult);

  beforeEach(() => { useQuery.mockClear(); });

  it('should perform the query', () => {
    render(
      <ResourceIndexPage
        Table={MockTable}
        resourceName={resourceName}
        useQuery={useQuery}
      />,
      { store: true },
    );

    expect(useQuery).toHaveBeenCalled();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <ResourceIndexPage
        Table={MockTable}
        resourceName={resourceName}
        useQuery={useQuery}
      />,
      { store: true },
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the query is loading', () => {
    beforeEach(() => { useQuery.mockImplementation(() => loadingResult); });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPage
          Table={MockTable}
          resourceName={resourceName}
          useQuery={useQuery}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the query is failing', () => {
    beforeEach(() => { useQuery.mockImplementation(() => failureResult); });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPage
          Table={MockTable}
          resourceName={resourceName}
          useQuery={useQuery}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the query is passing', () => {
    const successResultWithData = {
      ...successResult,
      data: {
        ok: true,
        data: {
          rareBooks: [
            { title: 'On War' },
            { title: 'The Art of War' },
            { title: 'The Prince' },
          ],
        },
      },
    };

    beforeEach(() => {
      useQuery.mockImplementation(() => successResultWithData);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPage
          Table={MockTable}
          resourceName={resourceName}
          useQuery={useQuery}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with breadcrumbs: value', () => {
    const breadcrumbs: Breadcrumbs = [
      { label: 'Home' },
      { label: 'Library' },
      { label: 'Rare Books' },
    ];

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPage
          Table={MockTable}
          breadcrumbs={breadcrumbs}
          resourceName={resourceName}
          useQuery={useQuery}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with navigation: component', () => {
    const navigation = [
      {
        label: 'Nav Item',
        url: '/nav-item',
      },
      {
        label: 'Dropdown',
        items: [
          {
            label: 'Dropdown Item',
            url: '/dropdown-item',
          },
        ],
      },
    ];
    const Navigation = () => (<PageNavigation navigation={navigation} />);

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPage
          Table={MockTable}
          navigation={<Navigation />}
          resourceName={resourceName}
          useQuery={useQuery}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with navigation: value', () => {
    const navigation = [
      {
        label: 'Nav Item',
        url: '/nav-item',
      },
      {
        label: 'Dropdown',
        items: [
          {
            label: 'Dropdown Item',
            url: '/dropdown-item',
          },
        ],
      },
    ];

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPage
          Table={MockTable}
          navigation={navigation}
          resourceName={resourceName}
          useQuery={useQuery}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with title: value', () => {
    const title = 'Example Title';

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceIndexPage
          Table={MockTable}
          resourceName={resourceName}
          title={title}
          useQuery={useQuery}
        />,
        { store: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with subtitle: value', () => {
      const subtitle = 'Example Subtitle';

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourceIndexPage
            Table={MockTable}
            resourceName={resourceName}
            title={title}
            subtitle={subtitle}
            useQuery={useQuery}
          />,
          { store: true },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
