import * as React from 'react';

import '@testing-library/jest-dom';

import { Heading } from './index';
import { ButtonProps as Button } from '@components/button';
import { render } from '@test-helpers/rendering';

describe('<Heading />', () => {
  it('should render the contents', () => {
    const { getByRole } = render(
      <Heading size={1}>Greetings, Programs</Heading>,
    );

    const heading = getByRole('heading');

    expect(heading).toHaveTextContent('Greetings, Programs');
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <Heading size={1}>Greetings, Programs</Heading>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with buttons: value', () => {
    const buttons: Button[] = [
      {
        label: 'Go',
        type: 'primary',
      },
      {
        label: 'Stop',
        type: 'danger',
      },
    ];

    it('should render the buttons', () => {
      const { getAllByRole } = render(
        <Heading buttons={buttons} size={1}>Greetings, Programs</Heading>,
      );
      const expected = ['Go', 'Stop'];

      const rendered = getAllByRole('button');

      expect(rendered).toHaveLength(2);
      expect(rendered.map(btn => btn.textContent)).toEqual(expected);
    });

    it('should render the contents', () => {
      const { getByRole } = render(
        <Heading buttons={buttons} size={1}>Greetings, Programs</Heading>,
      );

      const heading = getByRole('heading');

      expect(heading).toHaveTextContent('Greetings, Programs');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Heading buttons={buttons} size={1}>Greetings, Programs</Heading>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with size: 2', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Heading size={2}>Greetings, Programs</Heading>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with size: 3', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Heading size={3}>Greetings, Programs</Heading>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with size: 4', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Heading size={4}>Greetings, Programs</Heading>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with size: 5', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Heading size={5}>Greetings, Programs</Heading>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with size: 6', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Heading size={6}>Greetings, Programs</Heading>,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
