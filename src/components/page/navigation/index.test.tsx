import * as React from 'react';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { PageNavigation } from './index';
import { render } from '@test-helpers/rendering';

describe('<PageNavigation>', () => {
  const navigation = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Launch Sites',
      url: '/launch-sites',
    },
    {
      label: 'Rockets',
      items: [
        {
          label: 'Engines',
          url: '/rockets/engines',
        },
        {
          label: 'Fuel Tanks',
          url: '/rockets/fuel-tanks',
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Strategies',
          url: '/administration/strategies',
        },
      ],
    },
  ];
  const theme = {
    navigation: 'bg-[#ff3366]',
    navigationList: 'font-mono',
  };

  it('should render the navigation items', () => {
    const {
      getByRole,
      getByText,
    } = render(
      <PageNavigation navigation={navigation} />,
      { router: true }
    );

    expect(getByText('Home')).toBeVisible();
    expect(getByRole('link', { name: 'Launch Sites' })).toBeVisible();
  });

  it('should render the dropdown toggles', () => {
    const { getByRole } = render(
      <PageNavigation navigation={navigation} />,
      { router: true }
    );

    expect(getByRole('button', { name: 'Rockets' })).toBeVisible();
    expect(getByRole('button', { name: 'Administration' })).toBeVisible();
  });

  it('should not render the dropdown links', () => {
    const { queryByRole } = render(
      <PageNavigation navigation={navigation} />,
      { router: true }
    );

    expect(queryByRole('link', { name: 'Engines' })).toBeNull();
    expect(queryByRole('link', { name: 'Fuel Tanks' })).toBeNull();
    expect(queryByRole('link', { name: 'Strategies' })).toBeNull();
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <PageNavigation navigation={navigation} />,
      { router: true, theme }
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('when the user clicks a navigation item', () => {
    it('should render the navigation items', () => {
      const {
        getByRole,
        getByText,
      } = render(
        <PageNavigation navigation={navigation} />,
        { router: true }
      );

      userEvent.click(getByRole('link', { name: 'Launch Sites' }));

      expect(getByRole('link', { name: 'Home' })).toBeVisible();
      expect(getByText('Launch Sites')).toBeVisible();
    });
  });

  describe('when the user opens a dropdown toggle', () => {
    it('should render the open dropdown links', () => {
      const {
        getByRole,
        queryByRole,
      } = render(
        <PageNavigation navigation={navigation} />,
        { router: true }
      );

      userEvent.click(getByRole('button', { name: 'Rockets' }));

      expect(getByRole('link', { name: 'Engines' })).toBeVisible();
      expect(getByRole('link', { name: 'Fuel Tanks' })).toBeVisible();
      expect(queryByRole('link', { name: 'Strategies' })).toBeNull();
    });

    it('should match the snapshot', () => {
      const {
        asFragment,
        getByRole,
      } = render(
        <PageNavigation navigation={navigation} />,
        { router: true, theme }
      );

      userEvent.click(getByRole('button', { name: 'Rockets' }));

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the user closes the dropdown toggle', () => {
      it('should not render the dropdown links', () => {
        const {
          getByRole,
          queryByRole,
        } = render(
          <PageNavigation navigation={navigation} />,
          { router: true, theme }
        );

        userEvent.click(getByRole('button', { name: 'Rockets' }));
        userEvent.click(getByRole('button', { name: 'Rockets' }));

        expect(queryByRole('link', { name: 'Engines' })).toBeNull();
        expect(queryByRole('link', { name: 'Fuel Tanks' })).toBeNull();
        expect(queryByRole('link', { name: 'Strategies' })).toBeNull();
      });
    });

    describe('when the user opens another dropdown toggle', () => {
      it('should render the open dropdown links', () => {
        const {
          getByRole,
          queryByRole,
        } = render(
          <PageNavigation navigation={navigation} />,
          { router: true }
        );

        userEvent.click(getByRole('button', { name: 'Rockets' }));
        userEvent.click(getByRole('button', { name: 'Administration' }));

        expect(queryByRole('link', { name: 'Engines' })).toBeNull();
        expect(queryByRole('link', { name: 'Fuel Tanks' })).toBeNull();
        expect(getByRole('link', { name: 'Strategies' })).toBeVisible();
      });
    });
  });

  describe('with className: value', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <PageNavigation className="text-red-500" navigation={navigation} />,
        { router: true, theme }
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
