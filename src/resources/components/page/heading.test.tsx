import * as React from 'react';

import '@testing-library/jest-dom';

import { ResourcePageHeading } from './heading';
import { ButtonProps as Button } from '@components/button';
import { render } from '@test-helpers/rendering';

describe('<ResourcePageHeading />', () => {
  const resourceName = 'rareBooks';

  describe('with a collection action', () => {
    const action = 'published';
    const data = {};
    const member = false;
    const status = 'uninitialized';
    const defaultOptions = {
      action,
      data,
      member,
      resourceName,
      status,
    };

    it('should render the heading', () => {
      const expected = 'Published Rare Books';
      const { getByRole } = render(<ResourcePageHeading {...defaultOptions} />);
      const heading = getByRole('heading');

      expect(heading).toHaveTextContent(expected);
    });

    it('should not render any buttons', () => {
      const { queryAllByRole } =
        render(<ResourcePageHeading {...defaultOptions} />);
      const rendered = queryAllByRole('button');

      expect(rendered).toHaveLength(0);
    });

    it('should match the snapshot', () => {
      const { asFragment } =
        render(<ResourcePageHeading {...defaultOptions} />);

      expect(asFragment()).toMatchSnapshot();
    });

    describe('with action: empty string', () => {
      const action = '';
      const options = {
        ...defaultOptions,
        action,
      };

      it('should render the heading', () => {
        const expected = 'Rare Books';
        const { getByRole } = render(<ResourcePageHeading {...options} />);
        const heading = getByRole('heading');

        expect(heading).toHaveTextContent(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          render(<ResourcePageHeading {...options} />);

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with buttons: value', () => {
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
      const options = {
        ...defaultOptions,
        buttons,
      };

      it('should render the heading', () => {
        const expected = 'Published Rare Books';
        const { getByRole } = render(<ResourcePageHeading {...options} />);
        const heading = getByRole('heading');

        expect(heading).toHaveTextContent(expected);
      });

      it('should display the buttons', () => {
        const { getAllByRole } = render(<ResourcePageHeading {...options} />);
        const expected = ['Rock', 'Paper', 'Scissors'];

        const rendered = getAllByRole('button');

        expect(rendered).toHaveLength(3);
        expect(rendered.map(button => button.textContent)).toEqual(expected);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          render(<ResourcePageHeading {...options} />);

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('with label: value', () => {
      const label = 'Custom Label';
      const options = {
        ...defaultOptions,
        label,
      };

      it('should render the heading', () => {
        const { getByRole } = render(<ResourcePageHeading {...options} />);
        const heading = getByRole('heading');

        expect(heading).toHaveTextContent(label);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          render(<ResourcePageHeading {...options} />);

        expect(asFragment()).toMatchSnapshot();
      });
    });
  });

  describe('with a member action', () => {
    const action = 'publish';
    const data = {};
    const member = true;
    const defaultOptions = {
      action,
      data,
      member,
      resourceName,
    };

    describe('when the status is "uninitialized"', () => {
      const status = 'uninitialized';
      const options = {
        ...defaultOptions,
        status,
      };

      it('should render the heading', () => {
        const expected = 'Loading Rare Book';
        const { getByRole } = render(<ResourcePageHeading {...options} />);
        const heading = getByRole('heading');

        expect(heading).toHaveTextContent(expected);
      });

      it('should not render any buttons', () => {
        const { queryAllByRole } =
          render(<ResourcePageHeading {...options} />);
        const rendered = queryAllByRole('button');

        expect(rendered).toHaveLength(0);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          render(<ResourcePageHeading {...options} />);

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the status is "loading"', () => {
      const status = 'loading';
      const options = {
        ...defaultOptions,
        status,
      };

      it('should render the heading', () => {
        const expected = 'Loading Rare Book';
        const { getByRole } = render(<ResourcePageHeading {...options} />);
        const heading = getByRole('heading');

        expect(heading).toHaveTextContent(expected);
      });

      it('should not render any buttons', () => {
        const { queryAllByRole } =
          render(<ResourcePageHeading {...options} />);
        const rendered = queryAllByRole('button');

        expect(rendered).toHaveLength(0);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          render(<ResourcePageHeading {...options} />);

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the status is "failure"', () => {
      const status = 'failure';
      const options = {
        ...defaultOptions,
        status,
      };

      it('should render the heading', () => {
        const expected = 'Loading Rare Book';
        const { getByRole } = render(<ResourcePageHeading {...options} />);
        const heading = getByRole('heading');

        expect(heading).toHaveTextContent(expected);
      });

      it('should not render any buttons', () => {
        const { queryAllByRole } =
          render(<ResourcePageHeading {...options} />);
        const rendered = queryAllByRole('button');

        expect(rendered).toHaveLength(0);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          render(<ResourcePageHeading {...options} />);

        expect(asFragment()).toMatchSnapshot();
      });
    });

    describe('when the status is "success"', () => {
      const status = 'success';
      const options = {
        ...defaultOptions,
        status,
      };

      it('should render the heading', () => {
        const expected = 'Publish Rare Book';
        const { getByRole } = render(<ResourcePageHeading {...options} />);
        const heading = getByRole('heading');

        expect(heading).toHaveTextContent(expected);
      });

      it('should not render any buttons', () => {
        const { queryAllByRole } =
          render(<ResourcePageHeading {...options} />);
        const rendered = queryAllByRole('button');

        expect(rendered).toHaveLength(0);
      });

      it('should match the snapshot', () => {
        const { asFragment } =
          render(<ResourcePageHeading {...options} />);

        expect(asFragment()).toMatchSnapshot();
      });

      describe('when the data includes a named resource', () => {
        const data = {
          rareBook: {
            name: 'Romance of the Three Kingdoms',
          },
        };
        const options = {
          ...defaultOptions,
          data,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Publish Romance of the Three Kingdoms';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });
    });

    describe('with action: empty string', () => {
      const action = '';

      describe('when the status is "success"', () => {
        const status = 'success';
        const options = {
          ...defaultOptions,
          action,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Rare Book';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });

        describe('when the data includes a named resource', () => {
          const data = {
            rareBook: {
              name: 'Romance of the Three Kingdoms',
            },
          };
          const options = {
            ...defaultOptions,
            action,
            data,
            status,
          };

          it('should render the heading', () => {
            const expected = 'Romance of the Three Kingdoms';
            const { getByRole } = render(<ResourcePageHeading {...options} />);
            const heading = getByRole('heading');

            expect(heading).toHaveTextContent(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              render(<ResourcePageHeading {...options} />);

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with buttons: value', () => {
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

      describe('when the status is "uninitialized"', () => {
        const status = 'uninitialized';
        const options = {
          ...defaultOptions,
          buttons,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Loading Rare Book';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should display the buttons', () => {
          const { getAllByRole } = render(<ResourcePageHeading {...options} />);
          const expected = ['Rock', 'Paper', 'Scissors'];

          const rendered = getAllByRole('button');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(button => button.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "loading"', () => {
        const status = 'loading';
        const options = {
          ...defaultOptions,
          buttons,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Loading Rare Book';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should display the buttons', () => {
          const { getAllByRole } = render(<ResourcePageHeading {...options} />);
          const expected = ['Rock', 'Paper', 'Scissors'];

          const rendered = getAllByRole('button');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(button => button.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "failure"', () => {
        const status = 'failure';
        const options = {
          ...defaultOptions,
          buttons,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Loading Rare Book';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should display the buttons', () => {
          const { getAllByRole } = render(<ResourcePageHeading {...options} />);
          const expected = ['Rock', 'Paper', 'Scissors'];

          const rendered = getAllByRole('button');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(button => button.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "success"', () => {
        const status = 'success';
        const options = {
          ...defaultOptions,
          buttons,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Publish Rare Book';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should display the buttons', () => {
          const { getAllByRole } = render(<ResourcePageHeading {...options} />);
          const expected = ['Rock', 'Paper', 'Scissors'];

          const rendered = getAllByRole('button');

          expect(rendered).toHaveLength(3);
          expect(rendered.map(button => button.textContent)).toEqual(expected);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });

        describe('when the data includes a named resource', () => {
          const data = {
            rareBook: {
              name: 'Romance of the Three Kingdoms',
            },
          };
          const options = {
            ...defaultOptions,
            buttons,
            data,
            status,
          };

          it('should render the heading', () => {
            const expected = 'Publish Romance of the Three Kingdoms';
            const { getByRole } = render(<ResourcePageHeading {...options} />);
            const heading = getByRole('heading');

            expect(heading).toHaveTextContent(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              render(<ResourcePageHeading {...options} />);

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with label: value', () => {
      const label = 'Custom Label';

      describe('when the status is "uninitialized"', () => {
        const status = 'uninitialized';
        const options = {
          ...defaultOptions,
          label,
          status,
        };

        it('should render the heading', () => {
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(label);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "loading"', () => {
        const status = 'loading';
        const options = {
          ...defaultOptions,
          label,
          status,
        };

        it('should render the heading', () => {
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(label);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "failure"', () => {
        const status = 'failure';
        const options = {
          ...defaultOptions,
          label,
          status,
        };

        it('should render the heading', () => {
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(label);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "success"', () => {
        const status = 'success';
        const options = {
          ...defaultOptions,
          label,
          status,
        };

        it('should render the heading', () => {
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(label);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });

        describe('when the data includes a named resource', () => {
          const data = {
            rareBook: {
              name: 'Romance of the Three Kingdoms',
            },
          };
          const options = {
            ...defaultOptions,
            data,
            label,
            status,
          };

          it('should render the heading', () => {
            const { getByRole } = render(<ResourcePageHeading {...options} />);
            const heading = getByRole('heading');

            expect(heading).toHaveTextContent(label);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              render(<ResourcePageHeading {...options} />);

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });

    describe('with singularName: value', () => {
      const singularName = 'rareTome';

      describe('when the status is "uninitialized"', () => {
        const status = 'uninitialized';
        const options = {
          ...defaultOptions,
          singularName,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Loading Rare Tome';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "loading"', () => {
        const status = 'loading';
        const options = {
          ...defaultOptions,
          singularName,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Loading Rare Tome';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "failure"', () => {
        const status = 'failure';
        const options = {
          ...defaultOptions,
          singularName,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Loading Rare Tome';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });
      });

      describe('when the status is "success"', () => {
        const status = 'success';
        const options = {
          ...defaultOptions,
          singularName,
          status,
        };

        it('should render the heading', () => {
          const expected = 'Publish Rare Tome';
          const { getByRole } = render(<ResourcePageHeading {...options} />);
          const heading = getByRole('heading');

          expect(heading).toHaveTextContent(expected);
        });

        it('should not render any buttons', () => {
          const { queryAllByRole } =
            render(<ResourcePageHeading {...options} />);
          const rendered = queryAllByRole('button');

          expect(rendered).toHaveLength(0);
        });

        it('should match the snapshot', () => {
          const { asFragment } =
            render(<ResourcePageHeading {...options} />);

          expect(asFragment()).toMatchSnapshot();
        });

        describe('when the data includes a named resource', () => {
          const data = {
            rareTome: {
              name: 'Romance of the Three Kingdoms',
            },
          };
          const options = {
            ...defaultOptions,
            data,
            singularName,
            status,
          };

          it('should render the heading', () => {
            const expected = 'Publish Romance of the Three Kingdoms';
            const { getByRole } = render(<ResourcePageHeading {...options} />);
            const heading = getByRole('heading');

            expect(heading).toHaveTextContent(expected);
          });

          it('should match the snapshot', () => {
            const { asFragment } =
              render(<ResourcePageHeading {...options} />);

            expect(asFragment()).toMatchSnapshot();
          });
        });
      });
    });
  });
});
