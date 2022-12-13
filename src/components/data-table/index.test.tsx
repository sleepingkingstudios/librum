import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { DataTable } from './index';
import type {
  DataTableColumn,
  DataMappingFunction,
} from './types';

type SpaceMission = {
  deltaV: string,
  launchDate?: string,
  missionName?: string,
  missionObjective: string,
  ordinal: string,
  program: string,
  programId?: number,
};

type SpaceProgram = {
  id: number,
  name: string,
};

describe('<DataTable />', () => {
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
  const expectedHeader = [
    'Mission Name',
    'Objective',
    'Delta V',
    'Launch Date',
    ' ',
  ];

  describe('when there is no matching data', () => {
    const data = {};
    const expectedMessage = 'There are no matching space missions.';

    it('should render the header cells', () => {
      const { getAllByRole } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );
      const cells = getAllByRole('columnheader');

      expect(cells).toHaveLength(5);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
    });

    it('should display the empty message', () => {
      const { getByRole } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );
      const cell = getByRole('cell');

      expect(cell.textContent).toBe(expectedMessage);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there are no rows', () => {
    const data: { 'spaceMissions': SpaceMission[] } = { 'spaceMissions': [] };
    const expectedMessage = 'There are no matching space missions.';

    it('should render the header cells', () => {
      const { getAllByRole } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );
      const cells = getAllByRole('columnheader');

      expect(cells).toHaveLength(5);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
    });

    it('should display the empty message', () => {
      const { getByRole } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );
      const cell = getByRole('cell');

      expect(cell.textContent).toBe(expectedMessage);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when there are many rows', () => {
    const data: { spaceMissions: SpaceMission[] } = {
      spaceMissions: [
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
      ],
    };
    const expectedBody = [
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

    it('should render the header cells', () => {
      const { getAllByRole } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );
      const cells = getAllByRole('columnheader');

      expect(cells).toHaveLength(5);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
    });

    it('should display the formatted data', () => {
      const { getAllByRole } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );
      const cells = getAllByRole('cell');

      expect(cells).toHaveLength(15);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedBody);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTable columns={columns} data={data} name={name} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with collapse: true', () => {
    describe('when there are no rows', () => {
      const data: { 'spaceMissions': SpaceMission[] } = { 'spaceMissions': [] };
      const expectedMessage = 'There are no matching space missions.';

      it('should render the header cells', () => {
        const { getAllByRole } = render(
          <DataTable collapse columns={columns} data={data} name={name} />,
        );
        const cells = getAllByRole('columnheader');

        expect(cells).toHaveLength(5);
        expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
      });

      it('should display the empty message', () => {
        const { getByRole } = render(
          <DataTable collapse columns={columns} data={data} name={name} />,
        );
        const cell = getByRole('cell');

        expect(cell.textContent).toBe(expectedMessage);
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTable collapse columns={columns} data={data} name={name} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });


    describe('when there are many rows', () => {
      const data: { spaceMissions: SpaceMission[] } = {
        spaceMissions: [
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
        ],
      };
      const expectedBody = [
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

      it('should render the header cells', () => {
        const { getAllByRole } = render(
          <DataTable collapse columns={columns} data={data} name={name} />,
        );
        const cells = getAllByRole('columnheader');

        expect(cells).toHaveLength(5);
        expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
      });

      it('should display the formatted data', () => {
        const { getAllByRole } = render(
          <DataTable collapse columns={columns} data={data} name={name} />,
        );
        const cells = getAllByRole('cell');

        expect(cells).toHaveLength(15);
        expect(cells.map(cell => cell.textContent)).toEqual(expectedBody);
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTable collapse columns={columns} data={data} name={name} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with emptyMessage: component', () => {
    const EmptyMessage = (): JSX.Element => (
      <span className="data-table-empty-message">
        You are not going to space today.
      </span>
    );

    describe('when there are no rows', () => {
      const data: { 'spaceMissions': SpaceMission[] } = { 'spaceMissions': [] };
      const expectedMessage = 'You are not going to space today.';

      it('should render the header cells', () => {
        const { getAllByRole } = render(
          <DataTable
            columns={columns}
            data={data}
            emptyMessage={EmptyMessage}
            name={name}
          />,
        );
        const cells = getAllByRole('columnheader');

        expect(cells).toHaveLength(5);
        expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
      });

      it('should display the empty message', () => {
        const { getByRole } = render(
          <DataTable
            columns={columns}
            data={data}
            emptyMessage={EmptyMessage}
            name={name}
          />,
        );
        const cell = getByRole('cell');

        expect(cell.textContent).toBe(expectedMessage);
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTable
            columns={columns}
            data={data}
            emptyMessage={EmptyMessage}
            name={name}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with emptyMessage: string', () => {
    const emptyMessage = 'You are not going to space today.';

    describe('when there are no rows', () => {
      const data: { 'spaceMissions': SpaceMission[] } = { 'spaceMissions': [] };

      it('should render the header cells', () => {
        const { getAllByRole } = render(
          <DataTable
            columns={columns}
            data={data}
            emptyMessage={emptyMessage}
            name={name}
          />,
        );
        const cells = getAllByRole('columnheader');

        expect(cells).toHaveLength(5);
        expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
      });

      it('should display the empty message', () => {
        const { getByRole } = render(
          <DataTable
            columns={columns}
            data={data}
            emptyMessage={emptyMessage}
            name={name}
          />,
        );
        const cell = getByRole('cell');

        expect(cell.textContent).toBe(emptyMessage);
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTable
            columns={columns}
            data={data}
            emptyMessage={emptyMessage}
            name={name}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with mapping: function', () => {
    type SpaceData = {
      spaceMissions: SpaceMission[],
      spacePrograms: SpaceProgram[],
    };

    const mapping: DataMappingFunction = (data: SpaceData) => {
      const {
        spaceMissions,
        spacePrograms,
      } = data;

      return spaceMissions.map(
        (mission: SpaceMission) => {
          const match = spacePrograms.find(
            (program) => (program.id === mission.programId)
          );
          const programName = match ? match.name : 'Unknown';

          return {
            ...mission,
            program: programName,
          };
        }
      );
    };
    const data = {
      spaceMissions: [
        {
          deltaV: '1,000 km/s',
          launchDate: '2050',
          missionObjective: 'Titan',
          ordinal: 'IX',
          programId: 0,
        },
        {
          deltaV: '10,000 km/s',
          launchDate: '2150',
          missionObjective: 'Alpha Centauri A',
          ordinal: 'X',
          programId: 1,
        },
        {
          deltaV: '100,000 km/s',
          launchDate: '3050',
          missionObjective: 'Andromeda',
          ordinal: 'XI',
          programId: 2,
        },
      ],
      spacePrograms: [
        {
          id: 0,
          name: 'Chronos',
        },
        {
          id: 1,
          name: 'Chiron',
        },
        {
          id: 2,
          name: 'Perseus'
        },
      ],
    };
    const expectedBody = [
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

    it('should render the header cells', () => {
      const { getAllByRole } = render(
        <DataTable
          columns={columns}
          data={data}
          mapping={mapping}
          name={name}
        />,
      );
      const cells = getAllByRole('columnheader');

      expect(cells).toHaveLength(5);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedHeader);
    });

    it('should display the formatted data', () => {
      const { getAllByRole } = render(
        <DataTable
          columns={columns}
          data={data}
          mapping={mapping}
          name={name}
        />,
      );
      const cells = getAllByRole('cell');

      expect(cells).toHaveLength(15);
      expect(cells.map(cell => cell.textContent)).toEqual(expectedBody);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTable
          columns={columns}
          data={data}
          mapping={mapping}
          name={name}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with scope: value', () => {
    const scope = 'rocketry';

    describe('when there are no rows', () => {
      const data: { 'spaceMissions': SpaceMission[] } = { 'spaceMissions': [] };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTable columns={columns} data={data} name={name} scope={scope} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when there are many rows', () => {
      const data: { spaceMissions: SpaceMission[] } = {
        spaceMissions: [
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
        ],
      };

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTable columns={columns} data={data} name={name} scope={scope} />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
