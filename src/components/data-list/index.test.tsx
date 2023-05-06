import * as React from 'react';

import { DataList } from './index';
import { render } from '@test-helpers/rendering';

type ExampleObject = {
  name: string,
  description?: string,
  role?: JSX.Element,
};

describe('<DataList />', () => {
  describe('with data: an empty object', () => {
    const data = {};

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataList data={data} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with data: value', () => {
    const data: ExampleObject = {
      name: 'Kevin Flynn',
      description: null,
      role: (<span className="role">User</span>),
    };

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataList data={data} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with data: value and defaultValue: an element', () => {
    const data: ExampleObject = {
      name: 'Kevin Flynn',
      description: null,
    };
    const defaultValue = (
      <em>unknown</em>
    );

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataList data={data} defaultValue={defaultValue} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with data: value and defaultValue: a string', () => {
    const data: ExampleObject = {
      name: 'Kevin Flynn',
      description: null,
    };
    const defaultValue = 'unknown';

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataList data={data} defaultValue={defaultValue} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
