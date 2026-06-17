import { describe, it, expect } from 'vitest';
import type { RootState } from '../../store';
import type { IProduct } from '../../../types';
import { selectFilteredProducts } from './selectors';

const makeProduct = (overrides: Partial<IProduct> = {}): IProduct => ({
  id: 1,
  name: 'Test',
  description: '',
  category: 'Hair',
  subCategory: 'shampoo',
  raiting: 4.0,
  price: 100,
  imsrcOfImg: '',
  ...overrides,
});

type SortBy = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

const state = (
  items: IProduct[],
  search: Partial<{
    categoryFilter: string;
    sortBy: SortBy;
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number;
  }> = {}
) =>
  ({
    goods: { items, status: 'idle', error: null },
    search: {
      isSearchModalOpen: false,
      categoryFilter: '',
      sortBy: 'default' as SortBy,
      minPrice: null,
      maxPrice: null,
      minRating: 0,
      ...search,
    },
  } as unknown as RootState);

const products = [
  makeProduct({ id: 1, category: 'Hair', subCategory: 'shampoo', price: 100, raiting: 3 }),
  makeProduct({ id: 2, category: 'Hair', subCategory: 'conditioner', price: 200, raiting: 4 }),
  makeProduct({ id: 3, category: 'Skin', subCategory: 'cream', price: 150, raiting: 5 }),
];

describe('selectFilteredProducts', () => {
  describe('filtering', () => {
    it('returns all products when no filters applied', () => {
      expect(selectFilteredProducts(state(products))).toHaveLength(3);
    });

    it('filters by category', () => {
      const result = selectFilteredProducts(state(products, { categoryFilter: 'Hair' }));
      expect(result).toHaveLength(2);
      expect(result.every(p => p.category === 'Hair')).toBe(true);
    });

    it('filters by subCategory', () => {
      const result = selectFilteredProducts(state(products, { categoryFilter: 'shampoo' }));
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('uses discountPrice (not price) for minPrice filter', () => {
      const items = [
        makeProduct({ id: 1, price: 200, discountPrice: 80 }),
        makeProduct({ id: 2, price: 150 }),
      ];
      const result = selectFilteredProducts(state(items, { minPrice: 100 }));
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('filters by maxPrice', () => {
      const result = selectFilteredProducts(state(products, { maxPrice: 150 }));
      expect(result).toHaveLength(2);
    });

    it('filters by minRating', () => {
      const result = selectFilteredProducts(state(products, { minRating: 4 }));
      expect(result).toHaveLength(2);
      expect(result.every(p => p.raiting >= 4)).toBe(true);
    });

    it('returns empty array when all products filtered out', () => {
      const result = selectFilteredProducts(state(products, { minRating: 10 }));
      expect(result).toHaveLength(0);
    });
  });

  describe('sorting', () => {
    it('sorts price-asc using discountPrice when available', () => {
      const items = [
        makeProduct({ id: 1, price: 300, discountPrice: 200 }),
        makeProduct({ id: 2, price: 100 }),
        makeProduct({ id: 3, price: 500, discountPrice: 50 }),
      ];
      const result = selectFilteredProducts(state(items, { sortBy: 'price-asc' }));
      expect(result.map(p => p.id)).toEqual([3, 2, 1]);
    });

    it('sorts price-desc', () => {
      const items = [
        makeProduct({ id: 1, price: 100 }),
        makeProduct({ id: 2, price: 300 }),
        makeProduct({ id: 3, price: 200 }),
      ];
      const result = selectFilteredProducts(state(items, { sortBy: 'price-desc' }));
      expect(result.map(p => p.id)).toEqual([2, 3, 1]);
    });

    it('sorts rating-desc', () => {
      const result = selectFilteredProducts(state(products, { sortBy: 'rating-desc' }));
      expect(result.map(p => p.id)).toEqual([3, 2, 1]);
    });

    it('default sort preserves original order', () => {
      const result = selectFilteredProducts(state(products));
      expect(result.map(p => p.id)).toEqual([1, 2, 3]);
    });
  });
});
