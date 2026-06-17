import { describe, it, expect } from 'vitest';
import type { RootState } from '../../store';
import type { ICartItem } from '../../../types';
import { selectTotalPrice, selectTotalQuantity, selectTotalDiscount } from './selectors';

const makeItem = (overrides: Partial<ICartItem> = {}): ICartItem => ({
  id: 1,
  name: 'Test Product',
  description: '',
  category: 'Hair',
  subCategory: 'shampoo',
  raiting: 4,
  price: 100,
  imsrcOfImg: '',
  totalQuantity: 1,
  ...overrides,
});

const state = (items: ICartItem[]) =>
  ({ cartList: { cartList: items } } as unknown as RootState);

describe('selectTotalPrice', () => {
  it('returns 0 for empty cart', () => {
    expect(selectTotalPrice(state([]))).toBe(0);
  });

  it('uses price when no discountPrice', () => {
    expect(selectTotalPrice(state([makeItem({ price: 100, totalQuantity: 3 })]))).toBe(300);
  });

  it('uses discountPrice instead of price when available', () => {
    expect(
      selectTotalPrice(state([makeItem({ price: 100, discountPrice: 70, totalQuantity: 2 })]))
    ).toBe(140);
  });

  it('sums multiple items correctly', () => {
    const items = [
      makeItem({ id: 1, price: 100, totalQuantity: 2 }),
      makeItem({ id: 2, price: 200, discountPrice: 150, totalQuantity: 1 }),
    ];
    expect(selectTotalPrice(state(items))).toBe(350);
  });
});

describe('selectTotalQuantity', () => {
  it('returns 0 for empty cart', () => {
    expect(selectTotalQuantity(state([]))).toBe(0);
  });

  it('sums totalQuantity across items', () => {
    const items = [
      makeItem({ id: 1, totalQuantity: 3 }),
      makeItem({ id: 2, totalQuantity: 2 }),
    ];
    expect(selectTotalQuantity(state(items))).toBe(5);
  });
});

describe('selectTotalDiscount', () => {
  it('returns 0 when no items have discountPrice', () => {
    expect(selectTotalDiscount(state([makeItem({ price: 100 })]))).toBe(0);
  });

  it('calculates (price - discountPrice) × quantity', () => {
    expect(
      selectTotalDiscount(state([makeItem({ price: 100, discountPrice: 70, totalQuantity: 2 })]))
    ).toBe(60);
  });

  it('sums discounts across multiple items, skips items without discountPrice', () => {
    const items = [
      makeItem({ id: 1, price: 100, discountPrice: 80, totalQuantity: 2 }),
      makeItem({ id: 2, price: 200, discountPrice: 150, totalQuantity: 1 }),
      makeItem({ id: 3, price: 50, totalQuantity: 3 }),
    ];
    expect(selectTotalDiscount(state(items))).toBe(90);
  });
});
