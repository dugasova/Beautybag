import { describe, it, expect } from 'vitest';
import reducer, {
  setIsSearchModalOpen,
  setCategoryFilter,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters,
} from './slice';

describe('search reducer', () => {
  describe('setIsSearchModalOpen', () => {
    it('opens the search modal', () => {
      const state = reducer(undefined, setIsSearchModalOpen(true));
      expect(state.isSearchModalOpen).toBe(true);
    });

    it('closes the search modal', () => {
      let state = reducer(undefined, setIsSearchModalOpen(true));
      state = reducer(state, setIsSearchModalOpen(false));
      expect(state.isSearchModalOpen).toBe(false);
    });
  });

  describe('setCategoryFilter', () => {
    it('updates categoryFilter', () => {
      const state = reducer(undefined, setCategoryFilter('Hair'));
      expect(state.categoryFilter).toBe('Hair');
    });

    it('sets empty string to clear filter', () => {
      let state = reducer(undefined, setCategoryFilter('Hair'));
      state = reducer(state, setCategoryFilter(''));
      expect(state.categoryFilter).toBe('');
    });
  });

  describe('setSortBy', () => {
    it('updates sortBy', () => {
      const state = reducer(undefined, setSortBy('price-asc'));
      expect(state.sortBy).toBe('price-asc');
    });
  });

  describe('setPriceRange', () => {
    it('sets minPrice from numeric string', () => {
      const state = reducer(undefined, setPriceRange({ type: 'min', value: '50' }));
      expect(state.minPrice).toBe(50);
    });

    it('sets maxPrice from numeric string', () => {
      const state = reducer(undefined, setPriceRange({ type: 'max', value: '200' }));
      expect(state.maxPrice).toBe(200);
    });

    it('sets minPrice to null when value is empty string', () => {
      let state = reducer(undefined, setPriceRange({ type: 'min', value: '50' }));
      state = reducer(state, setPriceRange({ type: 'min', value: '' }));
      expect(state.minPrice).toBeNull();
    });

    it('sets maxPrice to null when value is empty string', () => {
      let state = reducer(undefined, setPriceRange({ type: 'max', value: '200' }));
      state = reducer(state, setPriceRange({ type: 'max', value: '' }));
      expect(state.maxPrice).toBeNull();
    });
  });

  describe('setMinRating', () => {
    it('sets minRating to the given value', () => {
      const state = reducer(undefined, setMinRating(3));
      expect(state.minRating).toBe(3);
    });

    it('toggles back to 0 when the same value is dispatched again', () => {
      let state = reducer(undefined, setMinRating(3));
      state = reducer(state, setMinRating(3));
      expect(state.minRating).toBe(0);
    });
  });

  describe('resetFilters', () => {
    it('resets sortBy, prices and rating to defaults', () => {
      let state = reducer(undefined, setSortBy('price-desc'));
      state = reducer(state, setPriceRange({ type: 'min', value: '50' }));
      state = reducer(state, setPriceRange({ type: 'max', value: '300' }));
      state = reducer(state, setMinRating(4));
      state = reducer(state, resetFilters());

      expect(state.sortBy).toBe('default');
      expect(state.minPrice).toBeNull();
      expect(state.maxPrice).toBeNull();
      expect(state.minRating).toBe(0);
    });

    it('does NOT reset categoryFilter', () => {
      let state = reducer(undefined, setCategoryFilter('Hair'));
      state = reducer(state, resetFilters());
      expect(state.categoryFilter).toBe('Hair');
    });

    it('does NOT reset isSearchModalOpen', () => {
      let state = reducer(undefined, setIsSearchModalOpen(true));
      state = reducer(state, resetFilters());
      expect(state.isSearchModalOpen).toBe(true);
    });
  });
});
