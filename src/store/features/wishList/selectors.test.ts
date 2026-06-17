import { describe, it, expect } from 'vitest';
import type { RootState } from '../../store';
import type { IProduct } from '../../../types';
import { selectWishList, selectWishListCount } from './selectors';

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

const state = (items: IProduct[]) =>
  ({ wishList: { wishList: items } } as unknown as RootState);

describe('selectWishList', () => {
  it('returns empty array when wishlist is empty', () => {
    expect(selectWishList(state([]))).toEqual([]);
  });

  it('returns the wishlist items', () => {
    const items = [makeProduct(1), makeProduct(2)];
    expect(selectWishList(state(items))).toEqual(items);
  });
});

describe('selectWishListCount', () => {
  it('returns 0 for empty wishlist', () => {
    expect(selectWishListCount(state([]))).toBe(0);
  });

  it('returns correct count', () => {
    expect(selectWishListCount(state([makeProduct(1), makeProduct(2)]))).toBe(2);
  });

  it('returns the same value on repeated calls with same state (memoized)', () => {
    const s = state([makeProduct(1)]);
    const first = selectWishListCount(s);
    const second = selectWishListCount(s);
    expect(first).toBe(second);
  });
});
