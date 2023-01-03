import * as React from 'react';
import { Link } from 'react-router-dom';

import { Page } from '@components/page';
import type { NavigationProps } from '@components/page';

export const NotFoundPage = ({
  navigation,
}: {
  navigation?: NavigationProps,
}): JSX.Element => (
  <Page navigation={navigation}>
    <article>
      <h1 className="text-danger">
        Not Found
      </h1>

      <p className="text-danger">
        This place is not a place of honor.
        <br />
        No highly esteemed deed is commemorated here.
        <br />
        Nothing valued is here.
      </p>

      <p className="text-danger">
        What is here was dangerous and repulsive to us.
        <br />
        This message is a warning about danger.
      </p>

      <p className="text-danger">
        The danger is still present, in your time, as it was in ours.
      </p>

      <hr className="hr-fancy hr-muted m-5" />

      <p className="text-xl">
        <Link className="link-danger" to="/">Turn Back</Link>
      </p>
    </article>
  </Page>
);
