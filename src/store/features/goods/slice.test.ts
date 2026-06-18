import { describe, it, expect } from 'vitest';
import reducer, { fetchGoods } from './slice';
import type { IProduct } from '../../../types';

const makeProduct = (overrides: Partial<IProduct> = {}): IProduct => ({
  id: 1,
  name: 'Shampoo',
  description: '',
  category: 'Hair',
  subCategory: 'shampoo',
  raiting: 4,
  price: 100,
  imsrcOfImg: '',
  ...overrides,
});

describe('goods reducer', () => {
  it('has correct initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.items).toEqual([]);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });

  describe('fetchGoods.pending', () => {
    it('sets status to loading', () => {
      const state = reducer(undefined, fetchGoods.pending(''));
      expect(state.status).toBe('loading');
      expect(state.items).toEqual([]);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchGoods.fulfilled', () => {
    it('sets status to succeeded and stores items', () => {
      const products = [makeProduct({ id: 1 }), makeProduct({ id: 2, name: 'Conditioner' })];
      const state = reducer(undefined, fetchGoods.fulfilled(products, ''));
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(products);
      expect(state.error).toBeNull();
    });

    it('replaces previous items', () => {
      const oldProducts = [makeProduct({ id: 1 })];
      const newProducts = [makeProduct({ id: 2 }), makeProduct({ id: 3 })];

      let state = reducer(undefined, fetchGoods.fulfilled(oldProducts, ''));
      state = reducer(state, fetchGoods.fulfilled(newProducts, ''));

      expect(state.items).toEqual(newProducts);
      expect(state.items).toHaveLength(2);
    });
  });

  describe('fetchGoods.rejected', () => {
    it('sets status to failed and stores error message', () => {
      const error = new Error('Network error');
      const state = reducer(
        undefined,
        fetchGoods.rejected(error, ''),
      );
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network error');
      expect(state.items).toEqual([]);
    });

    it('uses fallback message when error.message is empty', () => {
      const action = {
        type: fetchGoods.rejected.type,
        error: { message: '' },
      };
      const state = reducer(undefined, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Failed to fetch goods');
    });

    it('clears loading status after rejection', () => {
      let state = reducer(undefined, fetchGoods.pending(''));
      expect(state.status).toBe('loading');

      state = reducer(state, fetchGoods.rejected(new Error('fail'), ''));
      expect(state.status).toBe('failed');
    });
  });
});
