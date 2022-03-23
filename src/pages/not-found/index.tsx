import * as React from 'react';
import { Link } from 'react-router-dom';

import { Page } from '@components/page';
import { useThemeStyles } from '@themes';
import { joinClassNames } from '@utils/react-utils';

const headingClassName =
  'mb-2 text-3xl text-center sm:text-left';
const linkClassName = 'font-serif';
const paragraphClassName =
  'mb-2 text-center sm:text-left';

export const NotFoundPage = (): JSX.Element => {
  const joinedHeaderNames = joinClassNames(
    headingClassName,
    useThemeStyles('header-danger'),
  );
  const joinedLinkNames = joinClassNames(
    linkClassName,
    useThemeStyles('link-danger'),
  );
  const joinedParagraphNames = joinClassNames(
    paragraphClassName,
    useThemeStyles('text-danger'),
  );

  return (
    <Page>
      <article>
        <h1 className={joinedHeaderNames}>
          Not Found
        </h1>

        <p className={joinedParagraphNames}>
          This place is not a place of honor.
          <br />
          No highly esteemed deed is commemorated here.
          <br />
          Nothing valued is here.
        </p>

        <p className={joinedParagraphNames}>
          What is here was dangerous and repulsive to us.
          <br />
          This message is a warning about danger.
        </p>

        <p className={joinedParagraphNames}>
          The danger is still present, in your time, as it was in ours.
        </p>

        <hr className="hr-fancy hr-muted m-5" />

        <p className="text-center sm:text-left text-xl">
          <Link className={joinedLinkNames} to="/">Turn Back</Link>
        </p>
      </article>
    </Page>
  );
}
