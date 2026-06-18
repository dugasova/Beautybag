import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useFirestore from './useFirestore';
import type { IProduct, ICartItem } from '../types';

const mockUpdateUserDataTransaction = vi.fn();
const mockCreateOrder = vi.fn();
const mockToastError = vi.fn();

vi.mock('../services/dbService', () => ({
  dbService: {
    updateUserDataTransaction: (...args: unknown[]) => mockUpdateUserDataTransaction(...args),
    createOrder: (...args: unknown[]) => mockCreateOrder(...args),
  },
}));

vi.mock('../context/AuthContext', () => ({
  UserAuth: () => ({ user: { email: 'test@example.com' } }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

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

beforeEach(() => {
  vi.clearAllMocks();
  mockUpdateUserDataTransaction.mockResolvedValue(undefined);
  mockCreateOrder.mockResolvedValue({ id: 'order-123' });
});

describe('useFirestore', () => {
  describe('updateWishList', () => {
    it('adds product to wishList when isFavorite=false', async () => {
      const product = makeProduct({ id: 1 });
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.updateWishList(product, false));

      expect(mockUpdateUserDataTransaction).toHaveBeenCalledWith('test@example.com', expect.any(Function));

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const output = updater({ wishList: [makeProduct({ id: 2 })] });
      expect(output.wishList).toHaveLength(2);
      expect(output.wishList[1].id).toBe(1);
    });

    it('removes product from wishList when isFavorite=true', async () => {
      const product = makeProduct({ id: 1 });
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.updateWishList(product, true));

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const output = updater({ wishList: [makeProduct({ id: 1 }), makeProduct({ id: 2 })] });
      expect(output.wishList).toHaveLength(1);
      expect(output.wishList[0].id).toBe(2);
    });

    it('handles undefined data gracefully', async () => {
      const product = makeProduct({ id: 1 });
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.updateWishList(product, false));

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const output = updater(undefined);
      expect(output.wishList).toHaveLength(1);
    });
  });

  describe('clearWishList', () => {
    it('sets wishList to empty array', async () => {
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.clearWishList());

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const output = updater({ wishList: [makeProduct()] });
      expect(output.wishList).toEqual([]);
    });
  });

  describe('updateCartList', () => {
    it('adds product with totalQuantity=1 when isInCart=false', async () => {
      const product = makeProduct({ id: 1 });
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.updateCartList(product, false));

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const output = updater({ savedProducts: [] });
      expect(output.savedProducts).toHaveLength(1);
      expect(output.savedProducts[0].totalQuantity).toBe(1);
    });

    it('removes product when isInCart=true', async () => {
      const product = makeProduct({ id: 1 });
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.updateCartList(product, true));

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const output = updater({ savedProducts: [{ ...makeProduct({ id: 1 }), totalQuantity: 2 }] });
      expect(output.savedProducts).toHaveLength(0);
    });
  });

  describe('moveFromCartToWishList', () => {
    it('removes from cart and adds to wishList', async () => {
      const product = makeProduct({ id: 1 });
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.moveFromCartToWishList(product));

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const cartItem: ICartItem = { ...makeProduct({ id: 1 }), totalQuantity: 1 };
      const output = updater({ savedProducts: [cartItem], wishList: [] });
      expect(output.savedProducts).toHaveLength(0);
      expect(output.wishList).toHaveLength(1);
      expect(output.wishList[0].id).toBe(1);
    });
  });

  describe('sendOrder', () => {
    it('creates order and clears saved products', async () => {
      const order = { items: [], totalPrice: 100, totalQuantity: 2 };
      const { result } = renderHook(() => useFirestore());

      let orderId: string | null = null;
      await act(async () => {
        orderId = await result.current.sendOrder(order);
      });

      expect(orderId).toBe('order-123');
      expect(mockCreateOrder).toHaveBeenCalledWith('test@example.com', order);

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      expect(updater()).toEqual({ savedProducts: [] });
    });
  });

  describe('updateCartQuantity', () => {
    it('updates quantity for the matching product', async () => {
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.updateCartQuantity(1, 5));

      const updater = mockUpdateUserDataTransaction.mock.calls[0][1];
      const cart: ICartItem[] = [
        { ...makeProduct({ id: 1 }), totalQuantity: 1 },
        { ...makeProduct({ id: 2 }), totalQuantity: 3 },
      ];
      const output = updater({ savedProducts: cart });
      expect(output.savedProducts[0].totalQuantity).toBe(5);
      expect(output.savedProducts[1].totalQuantity).toBe(3);
    });
  });

  describe('error handling', () => {
    it('shows error toast on failure', async () => {
      mockUpdateUserDataTransaction.mockRejectedValueOnce(new Error('fail'));
      const { result } = renderHook(() => useFirestore());

      await act(() => result.current.clearWishList());

      expect(mockToastError).toHaveBeenCalledWith('common.error');
    });
  });
});
