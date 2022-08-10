import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { FormButton } from './index';

describe('<FormInput />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <FormButton>Button</FormButton>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormButton className="custom-button">Button</FormButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with children: elements', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormButton className="custom-button">
          <span className="custom-icon" />
          Button
        </FormButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: button', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormButton type="button">Button</FormButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: reset', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormButton type="reset">Button</FormButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: submit', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <FormButton type="submit">Button</FormButton>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
