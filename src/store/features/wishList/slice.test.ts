import { describe, it, expect } from 'vitest';
import reducer, { addToWishList, removeFromWishList, clearWishList, setWishList } from './slice';
import type { IProduct } from '../../../types';

const makeProduct = (id: number): IProduct => ({
  id,
  name: 'Test',
  description: '',
  category: 'Hair',
  subCategory: 'shampoo',
  raiting: 4,
  price: 100,
  imsrcOfImg: '',
});

describe('wishList reducer', () => {
  describe('addToWishList', () => {
    it('adds a product to an empty wishlist', () => {
      const state = reducer(undefined, addToWishList(makeProduct(1)));
      expect(state.wishList).toHaveLength(1);
      expect(state.wishList[0].id).toBe(1);
    });

    it('adds multiple products', () => {
      let state = reducer(undefined, addToWishList(makeProduct(1)));
      state = reducer(state, addToWishList(makeProduct(2)));
      expect(state.wishList).toHaveLength(2);
    });
  });

  describe('removeFromWishList', () => {
    it('removes product by id', () => {
      let state = reducer(undefined, addToWishList(makeProduct(1)));
      state = reducer(state, addToWishList(makeProduct(2)));
      state = reducer(state, removeFromWishList(makeProduct(1)));
      expect(state.wishList).toHaveLength(1);
      expect(state.wishList[0].id).toBe(2);
    });

    it('does nothing when product not in wishlist', () => {
      let state = reducer(undefined, addToWishList(makeProduct(1)));
      state = reducer(state, removeFromWishList(makeProduct(99)));
      expect(state.wishList).toHaveLength(1);
    });
  });

  describe('clearWishList', () => {
    it('empties the wishlist', () => {
      let state = reducer(undefined, addToWishList(makeProduct(1)));
      state = reducer(state, addToWishList(makeProduct(2)));
      state = reducer(state, clearWishList());
      expect(state.wishList).toHaveLength(0);
    });
  });

  describe('setWishList', () => {
    it('replaces wishlist with provided items', () => {
      let state = reducer(undefined, addToWishList(makeProduct(1)));
      state = reducer(state, setWishList([makeProduct(10), makeProduct(11)]));
      expect(state.wishList).toHaveLength(2);
      expect(state.wishList[0].id).toBe(10);
    });
  });
});
