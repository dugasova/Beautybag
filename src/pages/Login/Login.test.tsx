import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n';
import Login from './Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../firebase', () => ({ auth: {} }));

const mockSignIn = vi.fn();
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
}));

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock('react-toastify', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const renderLogin = (initialEntry: string | { pathname: string; state?: unknown } = '/login') => {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Login />
    </MemoryRouter>
  );
};

const fillAndSubmit = async (email: string, password: string) => {
  await userEvent.type(screen.getByLabelText('Email Address'), email);
  await userEvent.type(screen.getByLabelText('Password'), password);
  await userEvent.click(screen.getByRole('button', { name: 'Log In' }));
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Login', () => {
  it('renders the title and disables submit until the form is valid', () => {
    renderLogin();
    expect(screen.getByText('Welcome back! Please enter your details to sign in.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeDisabled();
  });

  it('logs in, shows a success toast and redirects home by default', async () => {
    mockSignIn.mockResolvedValue({ user: { email: 'user@example.com' } });
    renderLogin();

    await fillAndSubmit('user@example.com', 'secret1');

    expect(mockSignIn).toHaveBeenCalledWith({}, 'user@example.com', 'secret1');
    expect(mockToastSuccess).toHaveBeenCalledWith('Successfully logged in!');
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('redirects to the page the user came from', async () => {
    mockSignIn.mockResolvedValue({ user: { email: 'user@example.com' } });
    renderLogin({ pathname: '/login', state: { prevPath: '/cart' } });

    await fillAndSubmit('user@example.com', 'secret1');

    expect(mockNavigate).toHaveBeenCalledWith('/cart', { replace: true });
  });

  it('shows an error message and toast on invalid credentials', async () => {
    mockSignIn.mockRejectedValue(new Error('invalid-credential'));
    renderLogin();

    await fillAndSubmit('user@example.com', 'wrongpass');

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    expect(mockToastError).toHaveBeenCalledWith('Invalid email or password');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to the register page', async () => {
    renderLogin();
    await userEvent.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
