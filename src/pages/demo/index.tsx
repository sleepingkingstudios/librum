import * as React from 'react';

import type {
  Response,
  ResponseStatus,
} from '@api';
import { DataList } from '@components/data-list';
import {
  Form,
  FormButton,
  FormField,
  FormRow,
} from '@components/form';
import { Page } from '@components/page';
import type { Breadcrumbs } from '@components/page';

type ExampleObject = {
  name: string;
  description?: string;
};

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

const listData: ExampleObject = {
  name: 'Magic Missile',
  description: null,
};

const listDefaultValue = (
  <em>(unknown)</em>
);

const defaultResponse: Response = {
  hasData: false,
  hasError: false,
  isUninitialized: false,
  isLoading: false,
  isErrored: false,
  isFailure: false,
  isSuccess: false,
  status: 'unknown' as ResponseStatus,
};

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

    <hr className="hr-muted m-5" />

    <h2>Data</h2>

    <p>This is a data list.</p>

    <DataList
      data={listData}
      defaultValue={listDefaultValue}
    />

    <hr className="hr-muted m-5" />

    <h2>Forms</h2>

    <br />

    <p>This is a full-width form.</p>

    <Form
      initialValues={{ generation: '1', version: 'red' }}
      request={(): null => null}
      status={defaultResponse}
    >
      <FormField name="version" />

      <FormField name="generation" />

      <FormButton type="submit">Submit</FormButton>
    </Form>

    <br />

    <p>This is a grid form.</p>

    <Form
      initialValues={{}}
      request={(): null => null}
      status={defaultResponse}
    >
      <FormRow cols={6}>
        <FormField name="strength" />
        <FormField name="dexterity" />
        <FormField name="constitution" />
        <FormField name="intelligence" />
        <FormField name="wisdom" />
        <FormField name="charisma" />

        <FormField name="armor_class" cols={2} />
        <FormField name="saving_throws" cols={2} />
        <FormField name="skills" cols={2} />
      </FormRow>

      <FormRow cols={4} reverse>
        <FormButton type="submit" cols={2}>Submit</FormButton>
        <FormButton>Cancel</FormButton>
      </FormRow>
    </Form>
  </Page>
);
