import * as React from 'react';

import type { Response } from '@api/types';
import type { DataTableData } from '@components/data-table/types';
import { LoadingOverlay } from '@components/loading-overlay';
import type { UseResourceQuery } from '@resources/api/types';
import { titleCase } from '@utils/text';

type DataTableProps = {
  data: DataTableData,
  name: string,
};

type ResourcesTableProps = {
  Table: DataTableType,
  loader?: JSX.Element,
  resourceName: string,
  useRequest: UseResourceQuery,
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
  resourceName,
  useRequest,
}: ResourcesTableProps): JSX.Element => {
  const response = useRequest();

  return (
    <div className="min-h-[10rem] relative resources-table">
      { renderContent({ Table, loader, resourceName, response }) }
    </div>
  );
};
