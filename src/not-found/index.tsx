import * as React from 'react';
import { Link } from 'react-router-dom';

import { FancyHr } from '@components/fancy-hr';
import { Page } from '@components/page';

const headingClassName =
  'font-serif text-text-strong dark:text-text-strong-dark mb-2 text-3xl' +
  ' text-center sm:text-left';
const linkClassName =
  'font-serif text-red-600 hover:text-red-700 dark:text-red-900 dark:hover:text-red-800';
const paragraphClassName =
  'mb-2 text-red-600 dark:text-red-900 text-center sm:text-left';

export const NotFoundPage = (): JSX.Element => {
  return (
    <Page>
      <article>
        <h1 className={headingClassName}>
          Not Found
        </h1>

        <p className={paragraphClassName}>
          No more tales worth telling, no more lives worth living.
          The fire fades.
        </p>

        <p className={paragraphClassName}>
          Now there is only enough light to look upon yesterday and despair-
        </p>

        <p className={paragraphClassName}>
          For all that I make is unworthy of completion.
        </p>

        <FancyHr className="m-5" color="muted" darkColor="muted" />

        <p className="text-center sm:text-left text-xl">
          <Link className={linkClassName} to="/">Turn Back</Link>
        </p>
      </article>
    </Page>
  );
}
