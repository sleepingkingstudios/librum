import * as React from 'react';

import '@testing-library/jest-dom';
import { render } from '@test-helpers/rendering';
import {
  buildComponent,
  isComponent,
  isElement,
  joinClassNames,
} from './react-utils';

const Component = ({
  label,
}: {
  label?: string,
}): JSX.Element => (<span>{ label || 'Example' }</span>);

describe('React utils', () => {
  describe('buildComponent', () => {
    it('should be a function', () => {
      expect(typeof buildComponent).toBe('function');
    });

    describe('with undefined', () => {
      it('should return null', () => {
        expect(buildComponent(undefined)).toBeNull();
      });
    });

    describe('with null', () => {
      it('should return null', () => {
        expect(buildComponent(null)).toBeNull();
      });
    });

    describe('with a string', () => {
      const str = 'Greetings, programs!';

      it('should return the string', () => {
        expect(buildComponent(str)).toBe(str);
      });
    });

    describe('with an object', () => {
      it('should return null', () => {
        expect(buildComponent({ ok: true })).toBeNull();
      });
    });

    describe('with a function', () => {
      const fn = (): null => null;

      it('should return null', () => {
        expect(buildComponent(fn)).toBeNull();
      });
    });

    describe('with a component', () => {
      const component = (<Component />);

      it('should return the component', () => {
        expect(buildComponent(component)).toBe(component);
      });
    });

    describe('with a component class', () => {
      it('should render the component', () => {
        const component = buildComponent(Component) as JSX.Element;
        const { getByText } = render(component);

        expect(getByText('Example')).toBeVisible();
      });

      describe('with props: value', () => {
        const props = { label: 'Custom' }

        it('should render the component', () => {
          const component = buildComponent(Component, props) as JSX.Element;
          const { getByText } = render(component);

          expect(getByText('Custom')).toBeVisible();
        });
      });
    });
  });

  describe('isComponent', () => {
    it('should be a function', () => {
      expect(typeof isComponent).toBe('function');
    });

    describe('with undefined', () => {
      it('should return false', () => {
        expect(isComponent(undefined)).toBe(false);
      });
    });

    describe('with null', () => {
      it('should return false', () => {
        expect(isComponent(null)).toBe(false);
      });
    });

    describe('with a string', () => {
      it('should return false', () => {
        expect(isComponent('Greetings, programs!')).toBe(false);
      });
    });

    describe('with an object', () => {
      it('should return false', () => {
        expect(isComponent({ ok: true })).toBe(false);
      });
    });

    describe('with a function', () => {
      const fn = (): null => null;

      it('should return false', () => {
        expect(isComponent(fn)).toBe(false);
      });
    });

    describe('with a component', () => {
      const component = (<Component />);

      it('should return true', () => {
        expect(isComponent(component)).toBe(false);
      });
    });

    describe('with a component class', () => {
      it('should return true', () => {
        expect(isComponent(Component)).toBe(true);
      });
    });
  });

  describe('isElement', () => {
    it('should be a function', () => {
      expect(typeof isElement).toBe('function');
    });

    describe('with undefined', () => {
      it('should return false', () => {
        expect(isElement(undefined)).toBe(false);
      });
    });

    describe('with null', () => {
      it('should return false', () => {
        expect(isElement(null)).toBe(false);
      });
    });

    describe('with a string', () => {
      it('should return false', () => {
        expect(isElement('Greetings, programs!')).toBe(false);
      });
    });

    describe('with an object', () => {
      it('should return false', () => {
        expect(isElement({ ok: true })).toBe(false);
      });
    });

    describe('with a function', () => {
      const fn = (): null => null;

      it('should return false', () => {
        expect(isElement(fn)).toBe(false);
      });
    });

    describe('with a component', () => {
      const component = (<Component />);

      it('should return true', () => {
        expect(isElement(component)).toBe(true);
      });
    });

    describe('with a component class', () => {
      it('should return true', () => {
        expect(isElement(Component)).toBe(false);
      });
    });
  });

  describe('joinClassNames()', () => {
    it('should be a function', () => {
      expect(typeof joinClassNames).toBe('function');
    });

    describe('with no arguments', () => {
      it('should return an empty string', () => {
        expect(joinClassNames()).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(joinClassNames(null)).toBe('');
      });
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(joinClassNames(undefined)).toBe('');
      });
    });

    describe('with an empty string', () => {
      const input = '';

      it('should return an empty string', () => {
        expect(joinClassNames(input)).toBe('');
      });
    });

    describe('with a string', () => {
      const input = 'some-class-name';

      it('should return the string', () => {
        expect(joinClassNames(input)).toBe(input);
      });
    });

    describe('with an array of empty strings', () => {
      const inputs = ['', '', ''];

      it('should return an empty string', () => {
        expect(joinClassNames(...inputs)).toBe('');
      });
    });

    describe('with an array of strings', () => {
      const inputs = ['some-class-name', 'other-class-name'];
      const expected = 'some-class-name other-class-name';

      it('should return the string', () => {
        expect(joinClassNames(...inputs)).toBe(expected);
      });
    });

    describe('with a mixed array', () => {
      const inputs = [
        null,
        'some-class-name other-class-name',
        undefined,
        '',
        'third-class-name'
      ];
      const expected = 'some-class-name other-class-name third-class-name';

      it('should return the string', () => {
        expect(joinClassNames(...inputs)).toBe(expected);
      });
    });
  });
});
