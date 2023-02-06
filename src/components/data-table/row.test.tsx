import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { DataTableRow } from './row';
import type { DataTableColumn } from './types';

type SpaceMission = {
  deltaV: string,
  launchDate?: string,
  missionName?: string,
  missionObjective: string,
  ordinal: string,
  program: string,
};

const RowWrapper = ({
  children,
}: {
  children: React.ReactNode,
}): JSX.Element => (<table><tbody>{ children }</tbody></table>);

describe('<DataTableRow />', () => {
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
  const data: SpaceMission = {
    deltaV: '1,000 km/s',
    missionObjective: '40 Eridani A',
    ordinal: 'VI',
    program: 'Hephaestus',
  };
  const expected = [
    'Hephaestus VI',
    '40 Eridani A',
    '1,000 km/s',
    'TBD',
    'Launch',
  ];

  it('should display the formatted data', () => {
    const { getAllByRole } = render(
      <DataTableRow columns={columns} data={data} />,
      { wrapper: RowWrapper },
    );
    const cells = getAllByRole('cell');

    expect(cells).toHaveLength(5);
    expect(cells.map(cell => cell.textContent)).toEqual(expected);
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <DataTableRow columns={columns} data={data} />,
      { wrapper: RowWrapper },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
