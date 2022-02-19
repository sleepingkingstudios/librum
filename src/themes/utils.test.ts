import {
  Theme,
  defaultTheme,
} from './theme';
import { applyTheme } from './utils';

describe('applyTheme()', () => {
  const theme: Theme = {
    ...defaultTheme,
    background: 'bg-rose-100 dark:bg-rose-900',
    name: 'Custom Theme',
    textAccent: '@textBase text-[#ff3366]',
    textBase: 'font-mono',
  };

  it('should be a function', () => {
    expect(typeof applyTheme).toBe('function');
  });

  describe('with a config that does not match any values', () => {
    const config = ['custom-config', 'example-config'];

    it('should return an empty string', () => {
      expect(applyTheme({ config, theme })).toBe('');
    });
  });

  describe('with a config that matches one value', () => {
    const config = ['custom-config', 'text-accent'];

    it('should return the configured values', () => {
      const expected = 'font-mono text-[#ff3366]';

      expect(applyTheme({ config, theme })).toBe(expected);
    });
  });

  describe('with a config that matches multiple values', () => {
    const config = ['background', 'custom-config', 'text-accent'];

    it('should return the configured values', () => {
      const expected = 'bg-rose-100 dark:bg-rose-900 font-mono text-[#ff3366]';

      expect(applyTheme({ config, theme })).toBe(expected);
    });
  });

  describe('with a theme with recursive tag definition', () => {
    const recursiveTheme: Theme = {
      ...defaultTheme,
      textBase: '@textAccent',
    };
    const config = ['text-accent'];
    const expected = 'Recursive theme tag @textBase (@textBase @textAccent)';

    it('should throw an error', () => {
      expect(() => applyTheme({ config, theme: recursiveTheme }))
        .toThrow(expected);
    });
  });
});
