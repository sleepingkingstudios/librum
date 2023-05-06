import * as React from 'react';

import { responseWithData } from '@api';
import { DataList } from '@components/data-list';
import { ResourcePage } from '@resources/components/page';
import type { ResourcePageProps } from '@resources/components/page';
import type { DataBlockData } from '@resources/types';
import { singularize } from '@utils/inflector';
import { Literal } from '@utils/types';

const defaultBook = {
  name: 'Unknown Book',
  slug: 'unknown-book',
  author: 'Unknown Author',
};

export const MockBlock = ({ data }: { data: DataBlockData }): JSX.Element => {
  const book = (data.rareBook || defaultBook) as Record<string, Literal>;

  return (<DataList data={book} />);
};

export const ResourceShowPage = ({
  Block,
  page,
  resourceName,
}: ResourcePageProps): JSX.Element => {
  const data: DataBlockData = {
    rareBook: {
      name: 'Gideon the Ninth',
      slug: 'gideon-9',
      author: 'Tammsyn Muir',
    },
  };
  const response = responseWithData({ data });
  const contents = (
    <div>
      <h1>Content for {singularize(resourceName)}</h1>

      <Block data={data} name={resourceName} />
    </div>
  );

  const pageWithDefaults = {
    ...page,
    contents,
  };

  return (
    <ResourcePage
      action={''}
      page={pageWithDefaults}
      resourceName={resourceName}
      response={response}
    />
  );
};
