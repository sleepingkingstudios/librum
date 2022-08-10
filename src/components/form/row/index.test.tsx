import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { FormRow } from './index';

const Item = (): JSX.Element => (<div className="row-item" />);

describe('<FormRow />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <FormRow><Item /></FormRow>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormRow className="custom-row"><Item /></FormRow>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with cols: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormRow cols={12}><Item /></FormRow>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with colsSm: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormRow colsSm={4}><Item /></FormRow>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with reverse: true', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormRow reverse><Item /></FormRow>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
