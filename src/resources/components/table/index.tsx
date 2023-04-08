import * as React from 'react';

import type { Response } from '@api';
import type { DataTableData } from '@components/data-table/types';
import { LoadingOverlay } from '@components/loading-overlay';
import { titleCase } from '@utils/text';

type DataTableProps = {
  data: DataTableData,
  name: string,
};

type ResourcesTableProps = {
  Table: DataTableType,
  loader?: JSX.Element,
  response: Response,
  resourceName: string,
};

export type DataTableType = (props: DataTableProps) => JSX.Element;

const renderContent = ({
  Table,
  loader,
  resourceName,
  response,
}: {
  Table: DataTableType,
  loader?: JSX.Element,
  resourceName: string,
  response: Response,
}): JSX.Element => {
  const {
    isLoading,
    hasData,
  } = response;

  if (isLoading) {
    return renderLoader({ loader, resourceName });
  }

  if (!hasData) {
    return (<Table data={{}} name={resourceName} />);
  }

  const data = response.data as DataTableData;

  return (<Table data={data} name={resourceName} />);
};

const renderLoader = ({
  loader,
  resourceName,
}: {
  loader?: JSX.Element,
  resourceName: string,
}): JSX.Element => {
  if (loader) { return(loader); }

  const message = `Loading ${titleCase(resourceName)}...`;

  return (<LoadingOverlay message={message} />);
};

export const ResourcesTable = ({
  Table,
  loader,
  response,
  resourceName,
}: ResourcesTableProps): JSX.Element => (
  <div className="min-h-[10rem] relative resources-table">
    { renderContent({ Table, loader, resourceName, response }) }
  </div>
);
