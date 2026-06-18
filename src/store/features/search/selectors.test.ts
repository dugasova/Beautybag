import { describe, it, expect } from 'vitest';
import type { RootState } from '../../store';
import {
  selectCategoryFilter,
  selectSortBy,
  selectMinPrice,
  selectMaxPrice,
  selectMinRating,
} from './selectors';

type SortBy = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

const makeState = (
  overrides: Partial<{
    categoryFilter: string;
    sortBy: SortBy;
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number;
  }> = {},
) =>
  ({
    search: {
      isSearchModalOpen: false,
      categoryFilter: '',
      sortBy: 'default' as SortBy,
      minPrice: null,
      maxPrice: null,
      minRating: 0,
      ...overrides,
    },
  }) as unknown as RootState;

describe('search selectors', () => {
  describe('selectCategoryFilter', () => {
    it('returns empty string by default', () => {
      expect(selectCategoryFilter(makeState())).toBe('');
    });

    it('returns the current category filter', () => {
      expect(selectCategoryFilter(makeState({ categoryFilter: 'Hair' }))).toBe('Hair');
    });
  });

  describe('selectSortBy', () => {
    it('returns "default" by default', () => {
      expect(selectSortBy(makeState())).toBe('default');
    });

    it('returns the current sort option', () => {
      expect(selectSortBy(makeState({ sortBy: 'price-asc' }))).toBe('price-asc');
    });
  });

  describe('selectMinPrice', () => {
    it('returns null by default', () => {
      expect(selectMinPrice(makeState())).toBeNull();
    });

    it('returns the min price value', () => {
      expect(selectMinPrice(makeState({ minPrice: 50 }))).toBe(50);
    });
  });

  describe('selectMaxPrice', () => {
    it('returns null by default', () => {
      expect(selectMaxPrice(makeState())).toBeNull();
    });

    it('returns the max price value', () => {
      expect(selectMaxPrice(makeState({ maxPrice: 300 }))).toBe(300);
    });
  });

  describe('selectMinRating', () => {
    it('returns 0 by default', () => {
      expect(selectMinRating(makeState())).toBe(0);
    });

    it('returns the min rating value', () => {
      expect(selectMinRating(makeState({ minRating: 4 }))).toBe(4);
    });
  });
});
