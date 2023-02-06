import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { DataTableHeader } from './header';
import type { DataTableColumn } from './types';

const TableWrapper = ({
  children,
}: {
  children: React.ReactNode,
}): JSX.Element => (<table>{ children }</table>);

describe('<DataTableHeader />', () => {
  const columns: DataTableColumn[] = [
    {
      name: 'missionName',
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
      name: 'launchDate',
    },
    {
      label: false,
      name: 'actions',
    },
  ];
  const expected = [
    'Mission Name',
    'Objective',
    'Delta V',
    'Launch Date',
    ' ',
  ];

  it('should render the header cells', () => {
    const { getAllByRole } = render(
      <DataTableHeader columns={columns} />,
      { wrapper: TableWrapper },
    );
    const cells = getAllByRole('columnheader');

    expect(cells).toHaveLength(5);
    expect(cells.map(cell => cell.textContent)).toEqual(expected);
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(
      <DataTableHeader columns={columns} />,
      { wrapper: TableWrapper },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
