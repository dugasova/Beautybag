import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAsync from './useAsync';

const mockSuccess = vi.fn();
const mockError = vi.fn();

vi.mock('react-toastify', () => ({
  toast: {
    success: (...args: unknown[]) => mockSuccess(...args),
    error: (...args: unknown[]) => mockError(...args),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

beforeEach(() => {
  mockSuccess.mockClear();
  mockError.mockClear();
});

describe('useAsync', () => {
  describe('loading state', () => {
    it('starts with loading=false', () => {
      const { result } = renderHook(() => useAsync());
      expect(result.current.loading).toBe(false);
    });

    it('sets loading=true while executing', async () => {
      let resolve!: (v: string) => void;
      const asyncFn = () => new Promise<string>((r) => { resolve = r; });

      const { result } = renderHook(() => useAsync());

      let promise: Promise<unknown>;
      act(() => {
        promise = result.current.execute(asyncFn);
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolve('done');
        await promise;
      });

      expect(result.current.loading).toBe(false);
    });

    it('sets loading=false after error', async () => {
      const asyncFn = () => Promise.reject(new Error('fail'));
      const { result } = renderHook(() => useAsync());

      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('success path', () => {
    it('returns the result on success', async () => {
      const asyncFn = () => Promise.resolve(42);
      const { result } = renderHook(() => useAsync());

      let value: number | null = null;
      await act(async () => {
        value = await result.current.execute(asyncFn);
      });

      expect(value).toBe(42);
    });

    it('shows success toast when successMessage provided', async () => {
      const asyncFn = () => Promise.resolve('ok');
      const { result } = renderHook(() => useAsync());

      await act(async () => {
        await result.current.execute(asyncFn, 'Saved!');
      });

      expect(mockSuccess).toHaveBeenCalledWith('Saved!');
    });

    it('does not show success toast when no successMessage', async () => {
      const asyncFn = () => Promise.resolve('ok');
      const { result } = renderHook(() => useAsync());

      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(mockSuccess).not.toHaveBeenCalled();
    });
  });

  describe('error path', () => {
    it('returns null on error', async () => {
      const asyncFn = () => Promise.reject(new Error('boom'));
      const { result } = renderHook(() => useAsync());

      let value: unknown = 'not null';
      await act(async () => {
        value = await result.current.execute(asyncFn);
      });

      expect(value).toBeNull();
    });

    it('shows custom error toast when errorMessage provided', async () => {
      const asyncFn = () => Promise.reject(new Error('boom'));
      const { result } = renderHook(() => useAsync());

      await act(async () => {
        await result.current.execute(asyncFn, undefined, 'Custom error');
      });

      expect(mockError).toHaveBeenCalledWith('Custom error');
    });

    it('shows fallback i18n error toast when no errorMessage', async () => {
      const asyncFn = () => Promise.reject(new Error('boom'));
      const { result } = renderHook(() => useAsync());

      await act(async () => {
        await result.current.execute(asyncFn);
      });

      expect(mockError).toHaveBeenCalledWith('common.error');
    });
  });
});
