import * as React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FancyHr } from './index';

describe('<FancyHr>', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<FancyHr />);

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with className: value', () => {
    it('should append the className', () => {
      const className = 'some-class-name';
      const { asFragment } = render(<FancyHr className={className} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with color: value', () => {
    it('should append the className', () => {
      const color = '[#ff3366]';
      const { asFragment } = render(<FancyHr color={color} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with darkColor: value', () => {
    it('should append the className', () => {
      const darkColor = '[#ff3366]';
      const { asFragment } = render(<FancyHr darkColor={darkColor} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
