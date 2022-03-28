import * as React from 'react';

import { Page } from '@components/page';
import type { Breadcrumbs } from '@components/page';

const breadcrumbs: Breadcrumbs = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Admin',
  },
  {
    label: 'Demo',
    url: '/demo',
  },
];

export const DemoPage = (): JSX.Element => (
  <Page breadcrumbs={breadcrumbs}>
    <h1>Demo</h1>

    <p>
      This page serves as a demonstration for the styled components defined for
      Librum.
    </p>

    <hr className="hr-muted m-5" />

    <h2>Headings</h2>

    <h3>Heading 3</h3>

    <h4>Heading 4</h4>

    <h5>Heading 5</h5>

    <h6>Heading 6</h6>

    <hr className="hr-muted m-5" />

    <h2>Headings With Text</h2>

    <p>This is separator text.</p>

    <h3>Heading 4</h3>

    <p>This is separator text.</p>

    <h4>Heading 4</h4>

    <p>This is separator text.</p>

    <h5>Heading 5</h5>

    <p>This is separator text.</p>

    <h6>Heading 6</h6>

    <p>This is separator text.</p>

    <hr className="hr-muted m-5" />

    <h3>Typography</h3>

    <p>This is a short paragraph.</p>

    <p>This will be a long paragraph.</p>

    <p>This will be a long paragraph.</p>

    <h4>Text Colors</h4>

    <p>This paragraph contains <span className="text-danger">danger text</span>.</p>

    <p>This paragraph contains <span className="text-muted">muted text</span>.</p>

    <h4>Links</h4>

    <p>This is a <a>basic link</a>.</p>

    <p>This is a <a className="link-danger">danger link</a>.</p>

    <p>This is a <a className="link-muted">muted link</a>.</p>
  </Page>
);
