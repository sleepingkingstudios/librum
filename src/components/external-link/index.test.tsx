import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';

import { ExternalLink } from './index';

describe('<ExternalLink />', () => {
  describe('with children: value', () => {
    const path = '/path/to/resource';
    const children = (<strong>Link Text</strong>);

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink to={path}>
          { children }
        </ExternalLink>,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', path);
      expect(link).toHaveTextContent('Link Text');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink to={path}>
          { children }
        </ExternalLink>,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with className: value', () => {
    const path = '/path/to/resource';

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink className="custom-link" to={path} />,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', path);
      expect(link).toHaveTextContent(path);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink className="custom-link" to={path} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with label: value', () => {
    const path = '/path/to/resource';

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink label="Link Text" to={path} />,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', path);
      expect(link).toHaveTextContent('Link Text');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink label="Link Text" to={path} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with to: null', () => {
    it('should return null', () => {
      const { container } = render(
        <ExternalLink to={null} />,
        { router: true },
      );

      expect(container.firstChild).toBeNull();
    });

    describe('with children: value', () => {
      const children = (<strong>Link Text</strong>);

      it('should render the contents', () => {
        const { getByText } = render(
          <ExternalLink to={null}>
            { children }
          </ExternalLink>,
          { router: true },
        );

        expect(getByText('Link Text')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ExternalLink to={null}>
            { children }
          </ExternalLink>,
          { router: true },
        );

        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('with className: value', () => {
      it('should return null', () => {
        const { container } = render(
          <ExternalLink className="custom-link" to={null} />,
          { router: true },
        );

        expect(container.firstChild).toBeNull();
      });
    });

    describe('with label: value', () => {
      it('should render the contents', () => {
        const { getByText } = render(
          <ExternalLink to={null} label="Link Text" />,
          { router: true },
        );

        expect(getByText('Link Text')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ExternalLink to={null} label="Link Text" />,
          { router: true },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with to: an empty string', () => {
    it('should return null', () => {
      const { container } = render(
        <ExternalLink to={''} />,
        { router: true },
      );

      expect(container.firstChild).toBeNull();
    });

    describe('with children: value', () => {
      const children = (<strong>Link Text</strong>);

      it('should render the contents', () => {
        const { getByText } = render(
          <ExternalLink to={''}>
            { children }
          </ExternalLink>,
          { router: true },
        );

        expect(getByText('Link Text')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ExternalLink to={''}>
            { children }
          </ExternalLink>,
          { router: true },
        );

        expect(asFragment).toMatchSnapshot();
      });
    });

    describe('with className: value', () => {
      it('should return null', () => {
        const { container } = render(
          <ExternalLink className="custom-link" to={''} />,
          { router: true },
        );

        expect(container.firstChild).toBeNull();
      });
    });

    describe('with label: value', () => {
      it('should render the contents', () => {
        const { getByText } = render(
          <ExternalLink to={''} label="Link Text" />,
          { router: true },
        );

        expect(getByText('Link Text')).toBeVisible();
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <ExternalLink to={''} label="Link Text" />,
          { router: true },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with to: an absolute path', () => {
    const path = '/path/to/resource';

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', path);
      expect(link).toHaveTextContent(path);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with to: a relative path', () => {
    const path = 'path/to/resource';

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', `/${path}`);
      expect(link).toHaveTextContent(path);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with to: a url', () => {
    const path = 'example.com/path/to/resource';

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', `https://${path}`);
      expect(link).toHaveTextContent(path);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with to: a url with a protocol', () => {
    const path = 'http://example.com/path/to/resource';

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', path);
      expect(link).toHaveTextContent(path);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with to: a url with a subdomain', () => {
    const path = 'www.example.com/path/to/resource';

    it('should generate the link', () => {
      const { getByRole } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      const link = getByRole('link');
      expect(link).toBeVisible();
      expect(link).toHaveAttribute('href', `https://${path}`);
      expect(link).toHaveTextContent(path);
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <ExternalLink to={path} />,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
