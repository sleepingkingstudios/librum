import * as React from 'react';

import {
  faBicycle,
  faPaperPlane,
  faTruckMonster,
} from '@fortawesome/free-solid-svg-icons';

import { Button } from '@components/button';
import type { ButtonProps } from '@components/button';
import { DataList } from '@components/data-list';
import {
  Form,
  FormButton,
  FormField,
  FormRow,
} from '@components/form';
import { Heading } from '@components/heading';
import { Page } from '@components/page';
import type { Breadcrumb } from '@components/page';
import { CoreNavigation } from '@core/navigation';

type ExampleObject = {
  name: string;
  description?: string;
};

const breadcrumbs: Breadcrumb[] = [
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

const buttons: ButtonProps[] = [
  {
    label: 'Show',
    type: 'info',
  },
  {
    label: 'Update',
    type: 'primary',
    outline: true,
  },
  {
    label: 'Destroy',
    type: 'danger',
    outline: true,
  },
];

const listData: ExampleObject = {
  name: 'Magic Missile',
  description: null,
};

const listDefaultValue = (
  <em>(unknown)</em>
);

export const DemoPage = (): JSX.Element => (
  <Page breadcrumbs={breadcrumbs} navigation={<CoreNavigation />}>
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

    <h3>Heading 3</h3>

    <p>This is separator text.</p>

    <h4>Heading 4</h4>

    <p>This is separator text.</p>

    <h5>Heading 5</h5>

    <p>This is separator text.</p>

    <h6>Heading 6</h6>

    <p>This is separator text.</p>

    <h3>
      <span className="text-danger mr-1">Headings</span>

      <span className="text-info mx-1">Can</span>

      <span className="text-muted mx-1">Also</span>

      <span className="text-primary mx-1">Have</span>

      <span className="text-success mx-1">Colorful</span>

      <span className="text-warning mx-1">Text</span>
    </h3>

    <hr className="hr-muted m-5" />

    <h3>Typography</h3>

    <p>This is a short paragraph.</p>

    <p>This will be a long paragraph.</p>

    <p>This will be a long paragraph.</p>

    <h4>Text Colors</h4>

    <p>This paragraph contains plain text.</p>

    <p>This paragraph contains <span className="text-danger">danger text</span>.</p>

    <p>This paragraph contains <span className="text-info">info text</span>.</p>

    <p>This paragraph contains <span className="text-muted">muted text</span>.</p>

    <p>This paragraph contains <span className="text-primary">primary text</span>.</p>

    <p>This paragraph contains <span className="text-success">success text</span>.</p>

    <p>This paragraph contains <span className="text-warning">warning text</span>.</p>

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

    <p>These are sample buttons:</p>

    <p>
      <Button>Default</Button>
      <Button type="primary">Primary</Button>
      <Button type="info">Info</Button>
      <Button type="success">Success</Button>
      <Button type="warning">Warning</Button>
      <Button type="danger">Danger</Button>
      <Button type="muted">Muted</Button>
    </p>

    <p>These are outline buttons:</p>

    <p>
      <Button outline>Default</Button>
      <Button type="primary" outline>Primary</Button>
      <Button type="info" outline>Info</Button>
      <Button type="success" outline>Success</Button>
      <Button type="warning" outline>Warning</Button>
      <Button type="danger" outline>Danger</Button>
      <Button type="muted" outline>Muted</Button>
    </p>

    <p>Buttons come in a range of sizes:</p>

    <p>
      <Button outline size="lg" icon={faTruckMonster} label="Large" />
      <Button outline size="md" icon={faBicycle} label="Medium" />
      <Button outline size="sm" icon={faPaperPlane} label="Small" />
    </p>

    <Heading buttons={buttons} size={3}>
      Heading With Buttons
    </Heading>

    <p>Headings can have attached buttons as well.</p>

    <Form
      initialValues={{ generation: '1', version: 'red' }}
      onSubmit={(): null => null}
    >
      <FormField name="version" />

      <FormField name="generation" />

      <FormButton type="submit">Submit</FormButton>
    </Form>

    <br />

    <p>This is a grid form.</p>

    <Form
      initialValues={{}}
      onSubmit={(): null => null}
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
