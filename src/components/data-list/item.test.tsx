import * as React from 'react';

import { DataListItem } from './item';
import { render } from '@test-helpers/rendering';

describe('<DataListItem />', () => {
  describe('with value: an element', () => {
    const label = 'components';
    const value = (<span>V, S, M (a glob of ectoplasm)</span>);

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with value: a number', () => {
    const label = 'powerLevel';
    const value = 9000;

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with value: a string', () => {
    const label = 'materialComponent';
    const value = 'The stone tear of a weeping angel';

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with value: false', () => {
    const label = 'somaticComponent';
    const value = false;

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with value: true', () => {
    const label = 'verbalComponent';
    const value = true;

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with value: null', () => {
    const label = 'classification';
    const value: string | null = null;

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with value: null and defaultValue: an element', () => {
    const label = 'category';
    const value: string | null = null;
    const defaultValue = (
      <strong>Arcane</strong>
    );

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} defaultValue={defaultValue} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with value: null and defaultValue: a string', () => {
    const label = 'castingTime';
    const value: string | null = null;
    const defaultValue = '1 action';

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataListItem label={label} value={value} defaultValue={defaultValue} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
