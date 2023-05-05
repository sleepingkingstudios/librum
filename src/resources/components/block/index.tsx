import * as React from 'react';

import type { Response } from '@api';
import { LoadingOverlay } from '@components/loading-overlay';
import type {
  ConfiguredDataBlock,
  DataBlockData,
} from '@resources/types';
import { singularize } from '@utils/inflector';
import { titleCase } from '@utils/text';

type ResourceBlockProps = {
  Block: ConfiguredDataBlock,
  loader?: JSX.Element,
  response: Response,
  resourceName: string,
  singularName?: string,
};

const renderContent = ({
  Block,
  loader,
  resourceName,
  response,
  singularName,
}: {
  Block: ConfiguredDataBlock,
  loader?: JSX.Element,
  resourceName: string,
  response: Response,
  singularName?: string,
}): JSX.Element => {
  const {
    isLoading,
    hasData,
  } = response;

  if (isLoading) {
    return renderLoader({ loader, resourceName, singularName });
  }

  if (!hasData) {
    return (<Block data={{}} name={resourceName} />);
  }

  const data = response.data as DataBlockData;

  return (<Block data={data} name={resourceName} />);
};

const renderLoader = ({
  loader,
  resourceName,
  singularName,
}: {
  loader?: JSX.Element,
  resourceName: string,
  singularName?: string,
}): JSX.Element => {
  if (loader) { return(loader); }

  const message =
    `Loading ${titleCase(singularName || singularize(resourceName))}...`;

  return (<LoadingOverlay message={message} />);
};

export const ResourceBlock = ({
  Block,
  loader,
  response,
  resourceName,
  singularName,
}: ResourceBlockProps): JSX.Element => (
  <div className="min-h-[10rem] relative resource-block">
    { renderContent({ Block, loader, resourceName, singularName, response }) }
  </div>
);
