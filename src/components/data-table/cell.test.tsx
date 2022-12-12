import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';
import type { DataTableColumn } from './types';

import { DataTableCell } from './cell';

type SpaceMission = {
  missionName?: string,
  ordinal?: number,
  program?: string,
};

const CellWrapper = ({
  children,
}: {
  children: React.ReactNode,
}): JSX.Element => (<table><tbody><tr>{ children }</tr></tbody></table>);

describe('<DataTableCell />', () => {
  describe('with a basic column', () => {
    const column: DataTableColumn = { name: 'missionName' };
    const data = { missionName: 'Hephaestus VI' };

    it('should display the data', () => {
      const { getByRole } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );
      const cell = getByRole('cell');

      expect(cell).toBeVisible();
      expect(cell.textContent).toBe('Hephaestus VI');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the data does not have a matching property', () => {
      const nonMatching = {};

      it('should display an empty cell', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe(' ');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has a null property', () => {
      const empty: SpaceMission = { missionName: null };

      it('should display an empty cell', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe(' ');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an empty property', () => {
      const empty = { missionName: '' };

      it('should display an empty cell', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe(' ');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an undefined property', () => {
      const empty: SpaceMission = { missionName: undefined };

      it('should display an empty cell', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe(' ');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with a column with align: value', () => {
    const column: DataTableColumn = {
      align: 'center',
      name: 'missionName',
    };
    const data = { missionName: 'Hephaestus VI' };

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with a column with default: component', () => {
    const Default = ({ data }: { data: SpaceMission }): JSX.Element => (
      <span className="data-table-cell-default">
        { `${data.program} ?` }
      </span>
    );
    const column: DataTableColumn = {
      default: Default,
      name: 'missionName',
    };
    const data = {
      missionName: 'Hephaestus VI',
      program: 'Hephaestus',
    };

    it('should display the data', () => {
      const { getByRole } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );
      const cell = getByRole('cell');

      expect(cell).toBeVisible();
      expect(cell.textContent).toBe('Hephaestus VI');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the data does not have a matching property', () => {
      const nonMatching = { program: 'Hephaestus' };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has a null property', () => {
      const empty: SpaceMission = { missionName: null, program: 'Hephaestus' };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an empty property', () => {
      const empty = { missionName: '', program: 'Hephaestus' };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an undefined property', () => {
      const empty: SpaceMission = {
        missionName: undefined,
        program: 'Hephaestus',
      };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with a column with default: function', () => {
    const fn = ({
      data,
    }: {
      data: SpaceMission,
    }): string => `${data.program} ?`;
    const column: DataTableColumn = {
      default: fn,
      name: 'missionName',
    };
    const data = {
      missionName: 'Hephaestus VI',
      program: 'Hephaestus',
    };

    it('should display the data', () => {
      const { getByRole } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );
      const cell = getByRole('cell');

      expect(cell).toBeVisible();
      expect(cell.textContent).toBe('Hephaestus VI');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the data does not have a matching property', () => {
      const nonMatching = { program: 'Hephaestus' };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has a null property', () => {
      const empty: SpaceMission = { missionName: null, program: 'Hephaestus' };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an empty property', () => {
      const empty = { missionName: '', program: 'Hephaestus' };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an undefined property', () => {
      const empty: SpaceMission = {
        missionName: undefined,
        program: 'Hephaestus',
      };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('Hephaestus ?');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with a column with default: string', () => {
    const column: DataTableColumn = {
      default: 'N/A',
      name: 'missionName',
    };
    const data = { missionName: 'Hephaestus VI' };

    it('should display the data', () => {
      const { getByRole } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );
      const cell = getByRole('cell');

      expect(cell).toBeVisible();
      expect(cell.textContent).toBe('Hephaestus VI');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the data does not have a matching property', () => {
      const nonMatching = {};

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('N/A');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={nonMatching} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has a null property', () => {
      const empty: SpaceMission = { missionName: null };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('N/A');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an empty property', () => {
      const empty = { missionName: '' };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('N/A');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the data has an undefined property', () => {
      const empty: SpaceMission = { missionName: undefined };

      it('should display the default value', () => {
        const { getByRole } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );
        const cell = getByRole('cell');

        expect(cell).toBeVisible();
        expect(cell.textContent).toBe('N/A');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <DataTableCell column={column} data={empty} />,
          { wrapper: CellWrapper },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with a column with numeric: true', () => {
    const column: DataTableColumn = {
      name: 'deltaV',
      numeric: true,
    };
    const data = { deltaV: '1,000 km/s' };

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with a column with value: component', () => {
    const MissionName = ({ data }: { data: SpaceMission }): JSX.Element => (
      <span className="data-table-cell-mission-name">
        { `${data.missionName} ${data.ordinal}` }
      </span>
    );
    const column: DataTableColumn = {
      name: 'missionName',
      value: MissionName,
    };
    const data = {
      missionName: 'Hephaestus',
      ordinal: 'VI',
    };

    it('should display the data', () => {
      const { getByRole } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );
      const cell = getByRole('cell');

      expect(cell).toBeVisible();
      expect(cell.textContent).toBe('Hephaestus VI');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with a column with value: function', () => {
    const fn = ({
      data,
    }: {
      data: SpaceMission,
    }): string => `${data.missionName} ${data.ordinal}`;
    const column: DataTableColumn = {
      name: 'missionName',
      value: fn,
    };
    const data = {
      missionName: 'Hephaestus',
      ordinal: 'VI',
    };

    it('should display the data', () => {
      const { getByRole } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );
      const cell = getByRole('cell');

      expect(cell).toBeVisible();
      expect(cell.textContent).toBe('Hephaestus VI');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <DataTableCell column={column} data={data} />,
        { wrapper: CellWrapper },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
