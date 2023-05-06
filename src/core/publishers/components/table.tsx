import * as React from 'react';
import { Link } from 'react-router-dom';

import { DataTable } from '@components/data-table';
import type {
  DataTableColumn,
  DataTableData,
} from '@components/data-table';
import { ExternalLink } from '@components/external-link';

type MaybePublisher = {
  name?: string,
  slug?: string,
  website?: string,
};

const PublisherLink = ({ data }: { data: MaybePublisher }): JSX.Element => (
  <Link to={`/publishers/${data.slug}`}>{ data.name }</Link>
);

const WebsiteLink = ({ data }: { data: MaybePublisher }): JSX.Element => (
  <ExternalLink to={data.website} />
);

const columns: DataTableColumn[] = [
  {
    name: 'name',
    value: PublisherLink,
  },
  {
    name: 'website',
    value: WebsiteLink,
  },
  {
    label: false,
    name: 'actions',
  }
];

export const PublishersTable = ({
  data,
}: {
  data: DataTableData,
}): JSX.Element => (
  <DataTable
    collapse
    columns={columns}
    data={data}
    name="publishers"
    scope="core"
  />
);
