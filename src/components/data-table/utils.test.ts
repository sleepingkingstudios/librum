import { alignmentClass } from './utils';
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
});
