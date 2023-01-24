import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourcePage } from './index';
import { ButtonProps as Button } from '@components/button';
import type { Breadcrumb } from '@components/page';
import { render } from '@test-helpers/rendering';
import type { ResourceApiHooks } from '../../api/types';
import type { ResourcePageOptions } from './types';

jest.mock('@components/page', () => require('@components/page/mocks'));
jest.mock('@components/page/breadcrumbs', () => require('@components/page/breadcrumbs/mocks'));

describe('<ResourcePage />', () => {
  const action = 'published';
  const apiHooks: ResourceApiHooks = {};
  const member = false;
  const resourceName = 'rareBooks';

  it('should display the breadcrumbs', () => {
    const page: ResourcePageOptions = {};
    const { getAllByRole } = render(
      <ResourcePage
        action={action}
        apiHooks={apiHooks}
        member={member}
        page={page}
        resourceName={resourceName}
      />
    );
    const expected = [
      'Home @ /',
      'Rare Books @ /rare-books',
      'Published (active)',
    ];

    const rendered = getAllByRole('listitem');

    expect(rendered).toHaveLength(3);
    expect(rendered.map(item => item.textContent)).toEqual(expected);
  });

  it('should display the heading', () => {
    const page: ResourcePageOptions = {};
    const { getByRole } = render(
      <ResourcePage
        action={action}
        apiHooks={apiHooks}
        member={member}
        page={page}
        resourceName={resourceName}
      />
    );

    const heading = getByRole('heading');

    expect(heading).toBeVisible();
    expect(heading).toHaveTextContent('Published Rare Books');
  });

  it('should match the snapshot', () => {
    const page: ResourcePageOptions = {};
    const { asFragment } = render(
      <ResourcePage
        action={action}
        apiHooks={apiHooks}
        member={member}
        page={page}
        resourceName={resourceName}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with breadcrumbs: value', () => {
    const page: ResourcePageOptions = {};
    const breadcrumbs: Breadcrumb[] = [
      {
        label: 'Lending Library',
        url: '/lending-library',
      },
    ];

    it('should display the breadcrumbs', () => {
      const { getAllByRole } = render(
        <ResourcePage
          action={action}
          breadcrumbs={breadcrumbs}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );
      const expected = [
        'Lending Library @ /lending-library',
        'Rare Books @ /lending-library/rare-books',
        'Published (active)',
      ];

      const rendered = getAllByRole('listitem');

      expect(rendered).toHaveLength(3);
      expect(rendered.map(item => item.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          breadcrumbs={breadcrumbs}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with contents: component', () => {
    const Contents = ({
      resourceName,
    }: {
      resourceName: string,
    }): JSX.Element => {
      return (<span>Contents for { resourceName }</span>);
    };

    it('should display the contents', () => {
      const page: ResourcePageOptions = { contents: Contents };
      const { getByText } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );

      const rendered = getByText('Contents for rareBooks');

      expect(rendered).toBeVisible();
    });

    it('should match the snapshot', () => {
      const page: ResourcePageOptions = { contents: Contents };
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with afterContents: component', () => {
      const AfterContents = ({
        resourceName,
      }: {
        resourceName: string,
      }): JSX.Element => {
        return (<span>After { resourceName }</span>);
      };
      const page: ResourcePageOptions = {
        afterContents: AfterContents,
        contents: Contents,
      };

      it('should display the contents', () => {
        const { getByText } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />
        );

        expect(getByText('Contents for rareBooks')).toBeVisible();
        expect(getByText('After rareBooks')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with beforeContents: component', () => {
      const BeforeContents = ({
        resourceName,
      }: {
        resourceName: string,
      }): JSX.Element => {
        return (<span>Before { resourceName }</span>);
      };
      const page: ResourcePageOptions = {
        beforeContents: BeforeContents,
        contents: Contents,
      };

      it('should display the contents', () => {
        const { getByText } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />
        );

        expect(getByText('Before rareBooks')).toBeVisible();
        expect(getByText('Contents for rareBooks')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with contents: element', () => {
    const contents = (<span>Custom Contents</span>);

    it('should display the contents', () => {
      const page: ResourcePageOptions = { contents };
      const { getByText } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );

      const rendered = getByText('Custom Contents');

      expect(rendered).toBeVisible();
    });

    it('should match the snapshot', () => {
      const page: ResourcePageOptions = { contents };
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with afterContents: element', () => {
      const afterContents = (<span>After Contents</span>);
      const page: ResourcePageOptions = { afterContents, contents };

      it('should display the contents', () => {
        const { getByText } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />
        );

        expect(getByText('After Contents')).toBeVisible();
        expect(getByText('Custom Contents')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with beforeContents: element', () => {
      const beforeContents = (<span>Before Contents</span>);
      const page: ResourcePageOptions = { beforeContents, contents };

      it('should display the contents', () => {
        const { getByText } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />
        );

        expect(getByText('Before Contents')).toBeVisible();
        expect(getByText('Custom Contents')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with page: { breadcrumbs: element }', () => {
    const breadcrumbs = (<span>Custom Breadcrumbs</span>);
    const page: ResourcePageOptions = { breadcrumbs };

    it('should display the custom breadcrumbs', () => {
      const { getByText } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );

      const rendered = getByText('Custom Breadcrumbs');

      expect(rendered).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with page: { breadcrumbs: value }', () => {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: 'Published Rare Books',
        active: true,
      },
    ];
    const page: ResourcePageOptions = { breadcrumbs };

    it('should display the breadcrumbs', () => {
      const { getAllByRole } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );
      const expected = [
        'Home @ /',
        'Published Rare Books (active)',
      ];

      const rendered = getAllByRole('listitem');

      expect(rendered).toHaveLength(2);
      expect(rendered.map(item => item.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with page: { buttons: value }', () => {
    const buttons: Button[] = [
      {
        label: 'Rock',
        type: 'primary',
      },
      {
        label: 'Paper',
        type: 'success',
      },
      {
        label: 'Scissors',
        type: 'danger',
      },
    ];
    const page: ResourcePageOptions = { buttons };

    it('should display the buttons', () => {
      const { getAllByRole } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );
      const expected = ['Rock', 'Paper', 'Scissors'];

      const rendered = getAllByRole('button');

      expect(rendered).toHaveLength(3);
      expect(rendered.map(button => button.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with page: { heading: value }', () => {
    const page: ResourcePageOptions = { heading: 'Rare Publications' };

    it('should display the heading', () => {
      const { getByRole } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );

      const heading = getByRole('heading');

      expect(heading).toBeVisible();
      expect(heading).toHaveTextContent('Rare Publications');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with page: { navigation: element }', () => {
    const navigation = (<span>Custom Navigation</span>);
    const page: ResourcePageOptions = { navigation };

    it('should display the custom navigation', () => {
      const { getByText } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );

      const rendered = getByText('Custom Navigation');

      expect(rendered).toBeVisible();
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with page: { navigation: value }', () => {
    const navigation = [
      {
        label: 'Nav Item',
        url: '/nav-item',
      },
      {
        label: 'Dropdown',
        items: [
          {
            label: 'Dropdown Item',
            url: '/dropdown-item',
          },
        ],
      },
    ];
    const page = { navigation };

    it('should display the navigation', () => {
      const { getAllByRole } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );
      const expected = [
        'Nav Item @ /nav-item',
        'Dropdown Item @ /dropdown-item',
      ];

      const rendered = getAllByRole('listitem', { name: 'navigation-item' });

      expect(rendered).toHaveLength(2);
      expect(rendered.map(item => item.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with page: { title: value }', () => {
    const title = 'Rare Books';

    it('should display the title', () => {
      const page = { title };
      const { getByLabelText } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />
      );

      const rendered = getByLabelText('title');

      expect(rendered).toBeVisible();
      expect(rendered).toHaveTextContent('Rare Books');
    });

    it('should match the snapshot', () => {
      const page = { title };
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with page: { subtitle: value }', () => {
      const subtitle = 'the Publishing';
      const page = { subtitle, title };

      it('should display the title and subtitle', () => {
        const { getByLabelText } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />
        );

        const rendered = getByLabelText('title');

        expect(rendered).toBeVisible();
        expect(rendered).toHaveTextContent('Rare Books: the Publishing');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ResourcePage
            action={action}
            apiHooks={apiHooks}
            member={member}
            page={page}
            resourceName={resourceName}
          />,
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with scope: value', () => {
    const page: ResourcePageOptions = {};
    const scope = 'lendingLibrary';

    it('should display the breadcrumbs', () => {
      const { getAllByRole } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
          scope={scope}
        />
      );
      const expected = [
        'Home @ /',
        'Lending Library @ /lending-library',
        'Rare Books @ /lending-library/rare-books',
        'Published (active)',
      ];

      const rendered = getAllByRole('listitem');

      expect(rendered).toHaveLength(4);
      expect(rendered.map(item => item.textContent)).toEqual(expected);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ResourcePage
          action={action}
          apiHooks={apiHooks}
          member={member}
          page={page}
          resourceName={resourceName}
          scope={scope}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
