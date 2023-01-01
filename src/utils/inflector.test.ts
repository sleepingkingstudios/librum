import {
  pastTense,
  pluralize,
  singularize,
} from './inflector';

describe('Utils inflector', () => {
  describe('pastTense()', () => {
    it('should be a function', () => {
      expect(typeof pastTense).toBe('function');
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(pastTense(undefined)).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(pastTense(null)).toBe('');
      });
    });

    describe('with an empty string', () => {
      it('should return an empty string', () => {
        expect(pastTense('')).toBe('');
      });
    });

    describe('with a word with basic conjugation', () => {
      it('should convert the word to past tense', () => {
        expect(pastTense('process')).toBe('processed');
      });
    });

    describe('with a word ending in "e"', () => {
      it('should convert the word to past tense', () => {
        expect(pastTense('create')).toBe('created');
      });
    });

    describe('with a word ending in "ind"', () => {
      it('should convert the word to past tense', () => {
        expect(pastTense('find')).toBe('found');
      });
    });

    describe('with a word ending in "y"', () => {
      it('should convert the word to past tense', () => {
        expect(pastTense('destroy')).toBe('destroyed');
      });
    });
  });

  describe('pluralize()', () => {
    const shouldPluralize = (singular: string, plural: string) => {
      it('should pluralize the word', () => {
        expect(pluralize(singular)).toBe(plural);
      });

      it('should not change the plural word', () => {
        expect(pluralize(plural)).toBe(plural);
      });
    };

    it('should be a function', () => {
      expect(typeof pluralize).toBe('function');
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(pluralize(undefined)).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(pluralize(null)).toBe('');
      });
    });

    describe('with an empty string', () => {
      it('should return an empty string', () => {
        expect(pluralize('')).toBe('');
      });
    });

    describe('with a word with basic pluralization', () => {
      shouldPluralize('word', 'words');
    });

    describe('with a word ending in "ch"', () => {
      shouldPluralize('torch', 'torches');
    });

    describe('with a word ending in "sh"', () => {
      shouldPluralize('fish', 'fishes');
    });

    describe('with a word ending in "ss"', () => {
      shouldPluralize('truss', 'trusses');
    });

    describe('with a word ending in "x"', () => {
      shouldPluralize('box', 'boxes');
    });

    describe('with a word ending in "z"', () => {
      shouldPluralize('buzz', 'buzzes');
    });

    describe('with a word ending in a consonant followed by "o"', () => {
      shouldPluralize('halo', 'haloes');
    });

    describe('with a word ending in a consonant followed by "y"', () => {
      shouldPluralize('winery', 'wineries');
    });

    describe('with irregular words', () => {
      shouldPluralize('child', 'children');

      shouldPluralize('person', 'people');
    });

    describe('with uncountable words', () => {
      shouldPluralize('data', 'data');
    });
  });

  describe('singularize()', () => {
    const shouldSingularize = (plural: string, singular: string) => {
      it('should singularize the word', () => {
        expect(singularize(plural)).toBe(singular);
      });

      it('should not change the singular word', () => {
        expect(singularize(singular)).toBe(singular);
      });
    };

    it('should be a function', () => {
      expect(typeof pluralize).toBe('function');
    });

    describe('with undefined', () => {
      it('should return an empty string', () => {
        expect(singularize(undefined)).toBe('');
      });
    });

    describe('with null', () => {
      it('should return an empty string', () => {
        expect(singularize(null)).toBe('');
      });
    });

    describe('with an empty string', () => {
      it('should return an empty string', () => {
        expect(singularize('')).toBe('');
      });
    });

    describe('with a word with basic pluralization', () => {
      shouldSingularize('words', 'word');
    });

    describe('with a word ending in "ches"', () => {
      shouldSingularize('torches', 'torch');
    });

    describe('with a word ending in "shes"', () => {
      shouldSingularize('fishes', 'fish');
    });

    describe('with a word ending in "sses"', () => {
      shouldSingularize('trusses', 'truss');
    });

    describe('with a word ending in "xes"', () => {
      shouldSingularize('boxes', 'box');
    });

    describe('with a word ending in "zes"', () => {
      shouldSingularize('buzzes', 'buzz');
    });

    describe('with a word ending in a consonant followed by "ies"', () => {
      shouldSingularize('wineries', 'winery');
    });

    describe('with a word ending in a consonant followed by "oes"', () => {
      shouldSingularize('haloes', 'halo');
    });

    describe('with irregular words', () => {
      shouldSingularize('children', 'child');

      shouldSingularize('people', 'person');
    });

    describe('with uncountable words', () => {
      shouldSingularize('data', 'data');
    });
  });
});
