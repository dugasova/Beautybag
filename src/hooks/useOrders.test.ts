import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useOrders from './useOrders';
import type { IOrder } from '../types';

const mockSubscribeToOrders = vi.fn();
const mockToastError = vi.fn();
let mockUser: { email: string } | null = { email: 'test@example.com' };

vi.mock('../services/dbService', () => ({
  dbService: {
    subscribeToOrders: (...args: unknown[]) => mockSubscribeToOrders(...args),
  },
}));

vi.mock('../context/AuthContext', () => ({
  UserAuth: () => ({ user: mockUser }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockOrder: IOrder = {
  id: 'order-1',
  items: [],
  totalPrice: 200,
  totalQuantity: 2,
  userId: 'test@example.com',
  createdAt: '2026-01-01',
  status: 'pending',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUser = { email: 'test@example.com' };
  mockSubscribeToOrders.mockReturnValue(vi.fn());
});

describe('useOrders', () => {
  it('starts with loading=true and empty orders', () => {
    const { result } = renderHook(() => useOrders());
    expect(result.current.loading).toBe(true);
    expect(result.current.orders).toEqual([]);
  });

  it('subscribes to orders when user is logged in', () => {
    renderHook(() => useOrders());
    expect(mockSubscribeToOrders).toHaveBeenCalledWith(
      'test@example.com',
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('populates orders from snapshot callback', () => {
    const { result } = renderHook(() => useOrders());

    const onData = mockSubscribeToOrders.mock.calls[0][1];
    act(() => onData([mockOrder]));

    expect(result.current.orders).toEqual([mockOrder]);
    expect(result.current.loading).toBe(false);
  });

  it('shows error toast and stops loading on error', () => {
    const { result } = renderHook(() => useOrders());

    const onError = mockSubscribeToOrders.mock.calls[0][2];
    act(() => onError(new Error('fail')));

    expect(mockToastError).toHaveBeenCalledWith('common.error');
    expect(result.current.loading).toBe(false);
  });

  it('sets empty orders and loading=false when no user', () => {
    mockUser = null;
    const { result } = renderHook(() => useOrders());

    expect(mockSubscribeToOrders).not.toHaveBeenCalled();
    expect(result.current.orders).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('calls unsubscribe on unmount', () => {
    const unsubscribe = vi.fn();
    mockSubscribeToOrders.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useOrders());
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
