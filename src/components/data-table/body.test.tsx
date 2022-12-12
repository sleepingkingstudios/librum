import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { DataTableBody } from './body';
import type { DataTableColumn } from './types';

type SpaceMission = {
  deltaV: string,
  launchDate?: string,
  missionName?: string,
  missionObjective: string,
  ordinal: string,
  program: string,
};

const BodyWrapper = ({
  children,
}: {
  children: React.ReactNode,
}): JSX.Element => (<table>{ children }</table>);

describe('<DataTableBody />', () => {
  const Actions = (): JSX.Element => (
    <span className="data-table-actions">Launch</span>
  );
  const columns: DataTableColumn[] = [
    {
      name: 'missionName',
      value: ({ data }: { data: SpaceMission }) => (
        `${data.program} ${data.ordinal}`
      ),
    },
    {
      label: 'Objective',
      name: 'missionObjective',
    },
    {
      name: 'deltaV',
      numeric: true,
    },
    {
      align: 'center',
      default: 'TBD',
      name: 'launchDate',
    },
    {
      label: false,
      name: 'actions',
      value: Actions,
    },
  ];
  const name = 'spaceMissions';

  describe('when there are no rows', () => {
    const data: SpaceMission[] = [];
    const expected = 'There are no matching space missions.';

    it('should display the empty message', () => {
      const { getByRole } = render(
        <DataTableBody columns={columns} data={data} name={name} />,
        { wrapper: BodyWrapper },
      );
      const cell = getByRole('cell');

      expect(cell.textContent).toBe(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableBody columns={columns} data={data} name={name} />,
        { wrapper: BodyWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there is one row', () => {
    const data: SpaceMission[] = [
      {
        deltaV: '1,000 km/s',
        missionObjective: '40 Eridani A',
        ordinal: 'VI',
        program: 'Hephaestus',
      },
    ];
    const expected = [
      'Hephaestus VI',
      '40 Eridani A',
      '1,000 km/s',
      'TBD',
      'Launch',
    ];

    it('should display the formatted data', () => {
      const { getAllByRole } = render(
        <DataTableBody columns={columns} data={data} name={name} />,
        { wrapper: BodyWrapper },
      );
      const cells = getAllByRole('cell');

      expect(cells).toHaveLength(5);
      expect(cells.map(cell => cell.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableBody columns={columns} data={data} name={name} />,
        { wrapper: BodyWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there are many rows', () => {
    const data: SpaceMission[] = [
      {
        deltaV: '1,000 km/s',
        launchDate: '2050',
        missionObjective: 'Titan',
        ordinal: 'IX',
        program: 'Chronos',
      },
      {
        deltaV: '10,000 km/s',
        launchDate: '2150',
        missionObjective: 'Alpha Centauri A',
        ordinal: 'X',
        program: 'Chiron',
      },
      {
        deltaV: '100,000 km/s',
        launchDate: '3050',
        missionObjective: 'Andromeda',
        ordinal: 'XI',
        program: 'Perseus',
      },
    ];
    const expected = [
      'Chronos IX',
      'Titan',
      '1,000 km/s',
      '2050',
      'Launch',
      'Chiron X',
      'Alpha Centauri A',
      '10,000 km/s',
      '2150',
      'Launch',
      'Perseus XI',
      'Andromeda',
      '100,000 km/s',
      '3050',
      'Launch',
    ];

    it('should display the formatted data', () => {
      const { getAllByRole } = render(
        <DataTableBody columns={columns} data={data} name={name} />,
        { wrapper: BodyWrapper },
      );
      const cells = getAllByRole('cell');

      expect(cells).toHaveLength(15);
      expect(cells.map(cell => cell.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableBody columns={columns} data={data} name={name} />,
        { wrapper: BodyWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with emptyMessage: component', () => {
    const EmptyMessage = (): JSX.Element => (
      <span className="data-table-empty-message">
        You are not going to space today.
      </span>
    );

    describe('when there are no rows', () => {
      const data: SpaceMission[] = [];
      const expected = 'You are not going to space today.';

      it('should display the empty message', () => {
        const { getByRole } = render(
          <DataTableBody
            columns={columns}
            data={data}
            emptyMessage={EmptyMessage}
            name={name}
          />,
          { wrapper: BodyWrapper },
        );
        const cell = getByRole('cell');

        expect(cell.textContent).toBe(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableBody
            columns={columns}
            data={data}
            emptyMessage={EmptyMessage}
            name={name}
          />,
          { wrapper: BodyWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with emptyMessage: string', () => {
    const emptyMessage = 'You are not going to space today.';

    describe('when there are no rows', () => {
      const data: SpaceMission[] = [];

      it('should display the empty message', () => {
        const { getByRole } = render(
          <DataTableBody
            columns={columns}
            data={data}
            emptyMessage={emptyMessage}
            name={name}
          />,
          { wrapper: BodyWrapper },
        );
        const cell = getByRole('cell');

        expect(cell.textContent).toBe(emptyMessage);
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableBody
            columns={columns}
            data={data}
            emptyMessage={emptyMessage}
            name={name}
          />,
          { wrapper: BodyWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
