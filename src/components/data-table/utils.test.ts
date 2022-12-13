import {
  alignmentClass,
  labelFor,
} from './utils';
import { DataTableColumn } from './types';

describe('<DataTable> utils', () => {
  describe('alignmentClass()', () => {
    it('should be a function', () => {
      expect(typeof alignmentClass).toBe('function');
    });

    describe('with a basic column', () => {
      const column: DataTableColumn = {
        name: 'launchSite',
      };

      it('should return null', () => {
        expect(alignmentClass(column)).toBeNull();
      });
    });

    describe('with a column with align: value', () => {
      const column: DataTableColumn = {
        align: 'center',
        name: 'launchDate',
      };

      it('should return the css class', () => {
        expect(alignmentClass(column)).toBe('text-center');
      });
    });

    describe('with a column with align: value and numeric: true', () => {
      const column: DataTableColumn = {
        align: 'center',
        name: 'index',
        numeric: true,
      };

      it('should return the css class', () => {
        expect(alignmentClass(column)).toBe('text-center');
      });
    });

    describe('with a column with numeric: true', () => {
      const column: DataTableColumn = {
        name: 'deltaV',
        numeric: true,
      };

      it('should return the css class', () => {
        expect(alignmentClass(column)).toBe('text-right');
      });
    });
  });

  describe('labelFor()', () => {
    it('should be a function', () => {
      expect(typeof labelFor).toBe('function');
    });

    describe('with a basic column', () => {
      const column: DataTableColumn = {
        name: 'launchSite',
      };

      it('should format the column name', () => {
        expect(labelFor({ column })).toBe('Launch Site');
      });
    });

    describe('with a column with label: false', () => {
      const column: DataTableColumn = {
        name: 'launchSite',
        label: false,
      };

      it('should return whitespace', () => {
        expect(labelFor({ column })).toBe(' ');
      });

      describe('with force: true', () => {
        it('should format the column name', () => {
          expect(labelFor({ column, force: true })).toBe('Launch Site');
        });
      });
    });

    describe('with a column with label: string', () => {
      const column: DataTableColumn = {
        name: 'launchSite',
        label: 'Launchpad',
      };

      it('should return the column label', () => {
        expect(labelFor({ column })).toBe(column.label);
      });
    });
  });
});
