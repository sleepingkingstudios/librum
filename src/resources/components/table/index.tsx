import * as React from 'react';

import type { Response } from '@api';
import type { DataTableData } from '@components/data-table';
import { LoadingOverlay } from '@components/loading-overlay';
import type { ConfiguredDataTable } from '@resources/types';
import { titleCase } from '@utils/text';

type ResourcesTableProps = {
  Table: ConfiguredDataTable,
  loader?: JSX.Element,
  response: Response,
  resourceName: string,
};

const renderContent = ({
  Table,
  loader,
  resourceName,
  response,
}: {
  Table: ConfiguredDataTable,
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
