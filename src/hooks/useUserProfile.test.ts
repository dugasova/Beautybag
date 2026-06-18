import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useUserProfile from './useUserProfile';
import type { IUserProfile, IAddress } from '../types';

const mockSubscribeToProfile = vi.fn();
const mockUpdateUserData = vi.fn();
const mockAddAddress = vi.fn();
const mockDeleteAddress = vi.fn();
const mockToastError = vi.fn();
let mockUser: { email: string } | null = { email: 'test@example.com' };

vi.mock('../services/dbService', () => ({
  dbService: {
    subscribeToProfile: (...args: unknown[]) => mockSubscribeToProfile(...args),
    updateUserData: (...args: unknown[]) => mockUpdateUserData(...args),
    addAddress: (...args: unknown[]) => mockAddAddress(...args),
    deleteAddress: (...args: unknown[]) => mockDeleteAddress(...args),
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

beforeEach(() => {
  vi.clearAllMocks();
  mockUser = { email: 'test@example.com' };
  mockSubscribeToProfile.mockReturnValue(vi.fn());
  mockUpdateUserData.mockResolvedValue(undefined);
  mockAddAddress.mockResolvedValue(undefined);
  mockDeleteAddress.mockResolvedValue(undefined);
});

describe('useUserProfile', () => {
  describe('subscription', () => {
    it('subscribes to profile when user is logged in', () => {
      renderHook(() => useUserProfile());
      expect(mockSubscribeToProfile).toHaveBeenCalledWith('test@example.com', expect.any(Function));
    });

    it('populates profile from snapshot callback', () => {
      const { result } = renderHook(() => useUserProfile());

      const callback = mockSubscribeToProfile.mock.calls[0][1];
      const profileData: IUserProfile = { displayName: 'Alice', phone: '+380501234567' };
      act(() => callback(profileData));

      expect(result.current.profile).toEqual(profileData);
      expect(result.current.loading).toBe(false);
    });

    it('sets empty profile and loading=false when no user', () => {
      mockUser = null;
      const { result } = renderHook(() => useUserProfile());

      expect(mockSubscribeToProfile).not.toHaveBeenCalled();
      expect(result.current.profile).toEqual({});
      expect(result.current.loading).toBe(false);
    });

    it('calls unsubscribe on unmount', () => {
      const unsubscribe = vi.fn();
      mockSubscribeToProfile.mockReturnValue(unsubscribe);

      const { unmount } = renderHook(() => useUserProfile());
      unmount();
      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('calls dbService.updateUserData with email and data', async () => {
      const { result } = renderHook(() => useUserProfile());
      const data: IUserProfile = { displayName: 'Bob' };

      await act(() => result.current.updateProfile(data));

      expect(mockUpdateUserData).toHaveBeenCalledWith('test@example.com', data);
    });

    it('shows error toast on failure', async () => {
      mockUpdateUserData.mockRejectedValueOnce(new Error('fail'));
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.updateProfile({ displayName: 'Bob' }));

      expect(mockToastError).toHaveBeenCalledWith('common.error');
    });

    it('does nothing when no user', async () => {
      mockUser = null;
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.updateProfile({ displayName: 'Bob' }));

      expect(mockUpdateUserData).not.toHaveBeenCalled();
    });
  });

  describe('addAddress', () => {
    const address: Omit<IAddress, 'id'> = {
      label: 'Home',
      firstName: 'Anna',
      lastName: 'Smith',
      address: '123 Main St',
      city: 'Kyiv',
      phone: '+380501234567',
    };

    it('calls dbService.addAddress', async () => {
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.addAddress(address));

      expect(mockAddAddress).toHaveBeenCalledWith('test@example.com', address);
    });

    it('shows error toast on failure', async () => {
      mockAddAddress.mockRejectedValueOnce(new Error('fail'));
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.addAddress(address));

      expect(mockToastError).toHaveBeenCalledWith('common.error');
    });

    it('does nothing when no user', async () => {
      mockUser = null;
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.addAddress(address));

      expect(mockAddAddress).not.toHaveBeenCalled();
    });
  });

  describe('deleteAddress', () => {
    it('calls dbService.deleteAddress', async () => {
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.deleteAddress('addr-1'));

      expect(mockDeleteAddress).toHaveBeenCalledWith('test@example.com', 'addr-1');
    });

    it('shows error toast on failure', async () => {
      mockDeleteAddress.mockRejectedValueOnce(new Error('fail'));
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.deleteAddress('addr-1'));

      expect(mockToastError).toHaveBeenCalledWith('common.error');
    });

    it('does nothing when no user', async () => {
      mockUser = null;
      const { result } = renderHook(() => useUserProfile());

      await act(() => result.current.deleteAddress('addr-1'));

      expect(mockDeleteAddress).not.toHaveBeenCalled();
    });
  });
});
