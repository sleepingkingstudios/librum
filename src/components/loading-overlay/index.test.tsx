import * as React from 'react';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { LoadingOverlay } from './index';

describe('<LoadingOverlay />', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <LoadingOverlay />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with animate: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <LoadingOverlay animate="bounce" />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with icon: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <LoadingOverlay icon={faLightbulb} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with icon: value and animate: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <LoadingOverlay animate="ping" icon={faLightbulb} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with message: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <LoadingOverlay message="Greeting programs..." />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
