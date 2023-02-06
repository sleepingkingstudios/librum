import * as React from 'react';

import '@testing-library/jest-dom';
import { faRadiation } from '@fortawesome/free-solid-svg-icons';
import userEvent from '@testing-library/user-event';

import { Button } from './index';
import { render } from '@test-helpers/rendering';

describe('<Button />', () => {
  it('should display the contents', () => {
    const { getByRole } = render(<Button>Greet</Button>);

    const button = getByRole('button');

    expect(button).toBeVisible();
    expect(button).toHaveTextContent('Greet');
  });

  it('should match the snapshot', () => {
    const { asFragment } = render(<Button>Greet</Button>);

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with className: value', () => {
    const className = 'btn-custom';

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Button className={className}>Greet</Button>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with disabled: true', () => {
    it('should display the contents', () => {
      const { getByRole } = render(<Button disabled>Greet</Button>);

      const button = getByRole('button');

      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Greet');
    });
  });

  describe('with htmlType: "button"', () => {
    const htmlType = 'button';

    it('should display the contents', () => {
      const { getByRole } = render(<Button htmlType={htmlType}>Greet</Button>);

      const button = getByRole('button');

      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Greet');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button htmlType={htmlType}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with htmlType: "reset"', () => {
    const htmlType = 'reset';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button htmlType={htmlType}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with htmlType: "submit"', () => {
    const htmlType = 'reset';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button htmlType={htmlType}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with label: value', () => {
    const label = 'Greet';

    it('should display the contents', () => {
      const { getByRole } = render(<Button label={label} />);

      const button = getByRole('button');

      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Greet');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button label={label} />);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with icon: value', () => {
      const icon = faRadiation;

      it('should display the contents', () => {
        const { getByRole } = render(<Button icon={icon} label={label} />);

        const button = getByRole('button');

        expect(button).toBeVisible();
        expect(button).toHaveTextContent('Greet');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(<Button icon={icon} label={label} />);

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with onClick: value', () => {
    const onClick = jest.fn();

    beforeEach(() => { onClick.mockClear(); });

    it('should display the contents', () => {
      const { getByRole } = render(<Button onClick={onClick}>Greet</Button>);

      const button = getByRole('button');

      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Greet');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button onClick={onClick}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('when the button is clicked', () => {
      it('should call the function', async () => {
        const { getByRole } = render(<Button onClick={onClick}>Greet</Button>);

        const button = getByRole('button');

        await userEvent.click(button);

        expect(onClick).toHaveBeenCalled();
      });
    });

    describe('with disabled: true', () => {
      describe('when the button is clicked', () => {
        it('should not call the function', async () => {
          const { getByRole } = render(
            <Button disabled onClick={onClick}>Greet</Button>
          );

          const button = getByRole('button');

          await userEvent.click(button);

          expect(onClick).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('with outline: true', () => {
    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Button outline>Greet</Button>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with size: lg', () => {
    const size = 'lg';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button size={size}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with size: sm', () => {
    const size = 'sm';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button size={size}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('with type: "danger"', () => {
    const type = 'danger';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button type={type}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with outline: true', () => {
      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Button outline type={type}>Greet</Button>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with type: "info"', () => {
    const type = 'info';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button type={type}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with outline: true', () => {
      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Button outline type={type}>Greet</Button>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with type: "muted"', () => {
    const type = 'muted';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button type={type}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with outline: true', () => {
      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Button outline type={type}>Greet</Button>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with type: "primary"', () => {
    const type = 'primary';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button type={type}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with outline: true', () => {
      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Button outline type={type}>Greet</Button>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with type: "success"', () => {
    const type = 'success';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button type={type}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with outline: true', () => {
      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Button outline type={type}>Greet</Button>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with type: "warning"', () => {
    const type = 'warning';

    it('should match the snapshot', () => {
      const { asFragment } = render(<Button type={type}>Greet</Button>);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with outline: true', () => {
      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Button outline type={type}>Greet</Button>
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with url: value', () => {
    const url = 'path/to/resource';

    it('should display the contents', () => {
      const { getByRole } = render(
        <Button url={url}>Greet</Button>,
        { router: true },
      );

      const button = getByRole('link');

      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Greet');
    });

    it('should match the snapshot', () => {
      const { asFragment } = render(
        <Button url={url}>Greet</Button>,
        { router: true },
      );

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with disabled: true', () => {
      it('should display the contents', () => {
        const { getByRole } = render(
          <Button disabled url={url}>Greet</Button>,
          { router: true },
        );

        const button = getByRole('button');

        expect(button).toBeVisible();
        expect(button).toHaveTextContent('Greet');
      });

      it('should match the snapshot', () => {
        const { asFragment } = render(
          <Button disabled url={url}>Greet</Button>,
          { router: true },
        );

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });
});
