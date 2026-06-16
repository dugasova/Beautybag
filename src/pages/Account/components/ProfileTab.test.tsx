import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '../../../i18n';
import ProfileTab from './ProfileTab';
import type { User } from 'firebase/auth';
import type { IUserProfile } from '../../../types';

vi.mock('../../../firebase', () => ({
  storage: {},
}));

vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn().mockResolvedValue('https://example.com/avatar.png'),
}));

const user = { email: 'user@example.com' } as User;

describe('ProfileTab', () => {
  it('pre-fills the form with the current profile values', () => {
    const profile: IUserProfile = { displayName: 'Alice', phone: '+380501234567' };
    render(<ProfileTab user={user} profile={profile} updateProfile={vi.fn()} />);

    expect(screen.getByLabelText('Display Name')).toHaveValue('Alice');
    expect(screen.getByLabelText('Phone')).toHaveValue('+380501234567');
    expect(screen.getByLabelText('Email')).toHaveValue('user@example.com');
  });

  it('resets the form when the profile loads asynchronously', () => {
    const profile: IUserProfile = {};
    const { rerender } = render(<ProfileTab user={user} profile={profile} updateProfile={vi.fn()} />);

    expect(screen.getByLabelText('Display Name')).toHaveValue('');

    rerender(<ProfileTab user={user} profile={{ displayName: 'Bob', phone: '+380671112233' }} updateProfile={vi.fn()} />);

    expect(screen.getByLabelText('Display Name')).toHaveValue('Bob');
    expect(screen.getByLabelText('Phone')).toHaveValue('+380671112233');
  });

  it('shows a validation error for a too-short display name', async () => {
    render(<ProfileTab user={user} profile={{}} updateProfile={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Display Name'), 'A');
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByText('Display name must be at least 2 characters')).toBeInTheDocument();
  });

  it('saves valid changes via updateProfile', async () => {
    const updateProfile = vi.fn().mockResolvedValue(undefined);
    const profile: IUserProfile = { displayName: 'Alice', phone: '+380501234567', avatarUrl: 'https://example.com/old.png' };
    render(<ProfileTab user={user} profile={profile} updateProfile={updateProfile} />);

    await userEvent.clear(screen.getByLabelText('Display Name'));
    await userEvent.type(screen.getByLabelText('Display Name'), 'Alice Updated');
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        displayName: 'Alice Updated',
        phone: '+380501234567',
        avatarUrl: 'https://example.com/old.png',
      });
    });
  });
});
