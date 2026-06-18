import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { useProductSearch } from './useProductSearch';
import type { IProduct } from '../types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const makeProduct = (overrides: Partial<IProduct> = {}): IProduct => ({
  id: 1,
  name: 'Shampoo',
  description: 'Hair shampoo',
  category: 'Hair',
  subCategory: 'shampoo',
  raiting: 4,
  price: 100,
  imsrcOfImg: '',
  ...overrides,
});

function createWrapper(items: IProduct[]) {
  const store = configureStore({
    reducer: {
      goods: () => ({ items, status: 'succeeded', error: null }),
      wishList: () => ({ wishList: [] }),
      cartList: () => ({ cartList: [] }),
      search: () => ({
        isSearchModalOpen: false,
        categoryFilter: '',
        sortBy: 'default',
        minPrice: null,
        maxPrice: null,
        minRating: 0,
      }),
      checkout: () => ({
        currentStep: 1,
        shippingAddress: {},
        paymentMethod: 'card',
        isProcessing: false,
        orderId: null,
      }),
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

const products = [
  makeProduct({ id: 1, name: 'Shampoo', description: 'For hair', category: 'Hair', subCategory: 'shampoo' }),
  makeProduct({ id: 2, name: 'Conditioner', description: 'Smooth hair', category: 'Hair', subCategory: 'conditioner' }),
  makeProduct({ id: 3, name: 'Face Cream', description: 'For skin', category: 'Skin', subCategory: 'cream' }),
];

describe('useProductSearch', () => {
  describe('initial state', () => {
    it('starts with empty query and no results', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      expect(result.current.query).toBe('');
      expect(result.current.searchResults).toEqual([]);
    });
  });

  describe('query threshold', () => {
    it('returns empty results for query shorter than 3 characters', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('sh'));
      expect(result.current.searchResults).toEqual([]);
    });

    it('returns empty results for whitespace-only query', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('   '));
      expect(result.current.searchResults).toEqual([]);
    });

    it('returns results when query has 3+ non-whitespace characters', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('sha'));
      expect(result.current.searchResults.length).toBeGreaterThan(0);
    });
  });

  describe('search by fields', () => {
    it('searches by product name', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('shampoo'));
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].id).toBe(1);
    });

    it('searches by description', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('smooth'));
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].id).toBe(2);
    });

    it('searches by category', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('skin'));
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].id).toBe(3);
    });

    it('searches by subCategory', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('cream'));
      expect(result.current.searchResults).toHaveLength(1);
      expect(result.current.searchResults[0].id).toBe(3);
    });

    it('search is case-insensitive', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('SHAMPOO'));
      expect(result.current.searchResults).toHaveLength(1);
    });

    it('returns multiple matches', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('hair'));
      expect(result.current.searchResults).toHaveLength(2);
    });
  });

  describe('no matches', () => {
    it('returns empty array when nothing matches', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('nonexistent'));
      expect(result.current.searchResults).toEqual([]);
    });
  });

  describe('resetSearch', () => {
    it('clears query and results', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper(products),
      });

      act(() => result.current.setQuery('shampoo'));
      expect(result.current.searchResults).toHaveLength(1);

      act(() => result.current.resetSearch());
      expect(result.current.query).toBe('');
      expect(result.current.searchResults).toEqual([]);
    });
  });

  describe('empty store', () => {
    it('returns empty results when no products in store', () => {
      const { result } = renderHook(() => useProductSearch(), {
        wrapper: createWrapper([]),
      });

      act(() => result.current.setQuery('shampoo'));
      expect(result.current.searchResults).toEqual([]);
    });
  });
});
