import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import wishListReducer from '../store/features/wishList/slice';
import cartListReducer from '../store/features/cartList/slice';
import useFirestoreSync from './useFirestoreSync';
import type { IProduct, ICartItem, IUserDocument } from '../types';

const mockSubscribeToUser = vi.fn();
let mockUser: { email: string } | null = { email: 'test@example.com' };

vi.mock('../services/dbService', () => ({
  dbService: {
    subscribeToUser: (...args: unknown[]) => mockSubscribeToUser(...args),
  },
}));

vi.mock('../context/AuthContext', () => ({
  UserAuth: () => ({ user: mockUser }),
}));

const makeProduct = (id: number): IProduct => ({
  id,
  name: `Product ${id}`,
  description: '',
  category: 'Hair',
  subCategory: 'shampoo',
  raiting: 4,
  price: 100,
  imsrcOfImg: '',
});

function createStore() {
  return configureStore({
    reducer: {
      wishList: wishListReducer,
      cartList: cartListReducer,
      search: () => ({}),
      goods: () => ({ items: [], status: 'idle', error: null }),
      checkout: () => ({}),
    },
  });
}

function createWrapper(store: ReturnType<typeof createStore>) {
  return ({ children }: { children: ReactNode }) =>
    createElement(Provider, { store }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUser = { email: 'test@example.com' };
  mockSubscribeToUser.mockReturnValue(vi.fn());
});

describe('useFirestoreSync', () => {
  it('subscribes to user data when user is logged in', () => {
    const store = createStore();
    renderHook(() => useFirestoreSync(), { wrapper: createWrapper(store) });

    expect(mockSubscribeToUser).toHaveBeenCalledWith('test@example.com', expect.any(Function));
  });

  it('dispatches setWishList when data has wishList', () => {
    const store = createStore();
    renderHook(() => useFirestoreSync(), { wrapper: createWrapper(store) });

    const callback = mockSubscribeToUser.mock.calls[0][1];
    const products = [makeProduct(1), makeProduct(2)];
    callback({ wishList: products } as IUserDocument);

    expect(store.getState().wishList.wishList).toEqual(products);
  });

  it('dispatches setCartList when data has savedProducts', () => {
    const store = createStore();
    renderHook(() => useFirestoreSync(), { wrapper: createWrapper(store) });

    const callback = mockSubscribeToUser.mock.calls[0][1];
    const items: ICartItem[] = [{ ...makeProduct(1), totalQuantity: 2 }];
    callback({ savedProducts: items } as IUserDocument);

    expect(store.getState().cartList.cartList).toHaveLength(1);
    expect(store.getState().cartList.cartList[0].totalQuantity).toBe(2);
  });

  it('clears wishList and cart when user is null', () => {
    mockUser = null;
    const store = createStore();

    // pre-populate store
    store.dispatch({ type: 'wishList/setWishList', payload: [makeProduct(1)] });
    store.dispatch({ type: 'cartList/setCartList', payload: [{ ...makeProduct(1), totalQuantity: 1 }] });

    renderHook(() => useFirestoreSync(), { wrapper: createWrapper(store) });

    expect(mockSubscribeToUser).not.toHaveBeenCalled();
    expect(store.getState().wishList.wishList).toEqual([]);
    expect(store.getState().cartList.cartList).toEqual([]);
  });

  it('calls unsubscribe on unmount', () => {
    const unsubscribe = vi.fn();
    mockSubscribeToUser.mockReturnValue(unsubscribe);

    const store = createStore();
    const { unmount } = renderHook(() => useFirestoreSync(), { wrapper: createWrapper(store) });

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
