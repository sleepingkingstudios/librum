import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourceBlock } from './index';
import {
  responseWithData,
  responseWithStatus,
} from '@api';
import { DataList } from '@components/data-list';
import type { DataBlockData } from '@resources/types';
import { render } from '@test-helpers/rendering';
import { Literal } from '@utils/types';

const guestUser = {
  name: 'Guest',
  role: 'guest',
};

const EmployeeBlock = ({ data }: { data: DataBlockData }): JSX.Element => {
  const employee =
    (data.currentEmployee || guestUser) as Record<string, Literal>;

  return (<DataList data={employee} />);
};

describe('<ResourceBlock />', () => {
  const resourceName = 'currentEmployees';
  const response = responseWithStatus({ status: 'uninitialized' });

  it('should display the block contents', () => {
    const expectedTerms = ['Name', 'Role'];
    const expectedDfns  = ['Guest', 'guest'];
    const { getAllByRole } = render(
      <ResourceBlock
        Block={EmployeeBlock}
        resourceName={resourceName}
        response={response}
      />
    );

    const terms = getAllByRole('term');
    const dfns = getAllByRole('definition');

    expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
    expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <ResourceBlock
        Block={EmployeeBlock}
        resourceName={resourceName}
        response={response}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the request is failing', () => {
    const response = responseWithStatus({ status: 'failure' });

    it('should display the block contents', () => {
      const expectedTerms = ['Name', 'Role'];
      const expectedDfns  = ['Guest', 'guest'];
      const { getAllByRole } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
        />
      );

      const terms = getAllByRole('term');
      const dfns = getAllByRole('definition');

      expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
      expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request is loading', () => {
    const response = responseWithStatus({ status: 'loading' });

    it('should not display the block contents', () => {
      const { queryAllByRole } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
        />
      );

      const terms = queryAllByRole('term');
      const dfns = queryAllByRole('definition');

      expect(terms).toHaveLength(0);
      expect(dfns).toHaveLength(0);
    });

    it('should display the loading message', () => {
      const { getByText } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
        />
      );

      const rendered = getByText('Loading Current Employee...');
      expect(rendered).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the request is successful', () => {
    const data = {
      currentEmployee: {
        name: 'Alan Bradley',
        role: 'user',
      },
    };
    const response = responseWithData({ data });

    it('should display the block contents', () => {
      const expectedTerms = ['Name', 'Role'];
      const expectedDfns  = ['Alan Bradley', 'user'];
      const { getAllByRole } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
        />
      );

      const terms = getAllByRole('term');
      const dfns = getAllByRole('definition');

      expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
      expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with singularName: value', () => {
    const singularName = 'currentUser';

    it('should display the block contents', () => {
      const expectedTerms = ['Name', 'Role'];
      const expectedDfns  = ['Guest', 'guest'];
      const { getAllByRole } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
          singularName={singularName}
        />
      );

      const terms = getAllByRole('term');
      const dfns = getAllByRole('definition');

      expect(terms.map(term => term.textContent)).toEqual(expectedTerms);
      expect(dfns.map(dfn => dfn.textContent)).toEqual(expectedDfns);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourceBlock
          Block={EmployeeBlock}
          resourceName={resourceName}
          response={response}
          singularName={singularName}
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the request is loading', () => {
      const response = responseWithStatus({ status: 'loading' });


      it('should display the loading message', () => {
        const { getByText } = render(
          <ResourceBlock
            Block={EmployeeBlock}
            resourceName={resourceName}
            response={response}
            singularName={singularName}
          />
        );

        const rendered = getByText('Loading Current User...');
        expect(rendered).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourceBlock
            Block={EmployeeBlock}
            resourceName={resourceName}
            response={response}
            singularName={singularName}
          />
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
