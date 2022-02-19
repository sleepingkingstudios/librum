import * as React from 'react';

// import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FancyHr } from './index';
import { render } from '@test-helpers/rendering';

describe('<FancyHr>', () => {
  const theme = {
    hr: '@hrBase border-red-500',
    hrDanger: '@hrBase border-green-500',
  };

  it('should match the snapshot', () => {
    const { asFragment } = render(<FancyHr />, { theme });

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with className: value', () => {
    it('should append the className', () => {
      const className = 'some-class-name';
      const { asFragment } =
        render(<FancyHr className={className} />, { theme });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with style: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(<FancyHr style="hr-danger" />, { theme });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
