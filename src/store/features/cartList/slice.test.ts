import { describe, it, expect } from 'vitest';
import reducer, {
  addToCartList,
  removeFromCartList,
  plusQuantity,
  minusQuantity,
  clearCart,
  setCartList,
} from './slice';
import type { ICartItem, IProduct } from '../../../types';

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

describe('cartList reducer', () => {
  describe('addToCartList', () => {
    it('adds a new item with totalQuantity 1', () => {
      const state = reducer(undefined, addToCartList(makeProduct()));
      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0].totalQuantity).toBe(1);
    });

    it('increments totalQuantity when item already exists', () => {
      const product = makeProduct();
      let state = reducer(undefined, addToCartList(product));
      state = reducer(state, addToCartList(product));
      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0].totalQuantity).toBe(2);
    });

    it('adds different products as separate entries', () => {
      let state = reducer(undefined, addToCartList(makeProduct({ id: 1 })));
      state = reducer(state, addToCartList(makeProduct({ id: 2 })));
      expect(state.cartList).toHaveLength(2);
    });
  });

  describe('removeFromCartList', () => {
    it('removes item by id', () => {
      let state = reducer(undefined, addToCartList(makeProduct({ id: 1 })));
      state = reducer(state, addToCartList(makeProduct({ id: 2 })));
      state = reducer(state, removeFromCartList(makeProduct({ id: 1 })));
      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0].id).toBe(2);
    });

    it('does nothing when item not in cart', () => {
      let state = reducer(undefined, addToCartList(makeProduct({ id: 1 })));
      state = reducer(state, removeFromCartList(makeProduct({ id: 99 })));
      expect(state.cartList).toHaveLength(1);
    });
  });

  describe('plusQuantity', () => {
    it('increments totalQuantity by 1', () => {
      let state = reducer(undefined, addToCartList(makeProduct()));
      state = reducer(state, plusQuantity(makeProduct()));
      expect(state.cartList[0].totalQuantity).toBe(2);
    });
  });

  describe('minusQuantity', () => {
    it('decrements totalQuantity when qty > 1', () => {
      let state = reducer(undefined, addToCartList(makeProduct()));
      state = reducer(state, plusQuantity(makeProduct()));
      state = reducer(state, minusQuantity(makeProduct()));
      expect(state.cartList[0].totalQuantity).toBe(1);
    });

    it('does not go below 1 (item stays in cart)', () => {
      let state = reducer(undefined, addToCartList(makeProduct()));
      state = reducer(state, minusQuantity(makeProduct()));
      expect(state.cartList[0].totalQuantity).toBe(1);
      expect(state.cartList).toHaveLength(1);
    });
  });

  describe('clearCart', () => {
    it('empties the cart', () => {
      let state = reducer(undefined, addToCartList(makeProduct({ id: 1 })));
      state = reducer(state, addToCartList(makeProduct({ id: 2 })));
      state = reducer(state, clearCart());
      expect(state.cartList).toHaveLength(0);
    });
  });

  describe('setCartList', () => {
    it('replaces the cart with provided items', () => {
      const items: ICartItem[] = [{ ...makeProduct({ id: 5 }), totalQuantity: 3 }];
      const state = reducer(undefined, setCartList(items));
      expect(state.cartList).toHaveLength(1);
      expect(state.cartList[0].id).toBe(5);
      expect(state.cartList[0].totalQuantity).toBe(3);
    });

    it('coerces totalQuantity: 0 to 1', () => {
      const items = [{ ...makeProduct(), totalQuantity: 0 }];
      const state = reducer(undefined, setCartList(items));
      expect(state.cartList[0].totalQuantity).toBe(1);
    });
  });
});
