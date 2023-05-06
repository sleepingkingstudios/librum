import * as React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';

import { DataList } from '@components/data-list';
import type { DataListData } from '@components/data-list';
import { ExternalLink } from '@components/external-link';

type MaybePublisher = {
  name?: string,
  slug?: string,
  website?: string,
};

const defaultPublisher: MaybePublisher = {
  name: null,
  slug: null,
  website: null,
};

const formatData = (publisher: MaybePublisher): DataListData => {
  const { name, slug, website } = publisher;

  return {
    name: name || ' ',
    slug: slug || ' ',
    website: website ? (<WebsiteLink to={website.toString()} />) : ' ',
  };
};

const WebsiteLink = ({ to }: { to: string }): JSX.Element => (
  <ExternalLink to={to} />
);

export const PublisherBlock = ({
  data,
}: {
  data: Record<string, Record<string, unknown>>,
}): JSX.Element => {
  const publisher =
    'publisher' in data ? data.publisher as MaybePublisher : defaultPublisher;
  const formatted = formatData(publisher);

  return(
    <>
      <DataList data={formatted} />

      <Link to="/publishers">
        <Icon className="mr-1" icon={faLeftLong} />

        Back to Publishers
      </Link>
    </>
  );
};
