import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n';
import Register from './Register';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../firebase', () => ({ auth: {}, db: {} }));

const mockCreateUser = vi.fn();
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
}));

const mockSetDoc = vi.fn().mockResolvedValue(undefined);
vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => ({ __args: args }),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock('react-toastify', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const renderRegister = () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
};

const fillAndSubmit = async (email: string, password: string) => {
  await userEvent.type(screen.getByLabelText('Email Address'), email);
  await userEvent.type(screen.getByLabelText('Password'), password);
  await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Register', () => {
  it('renders the title and disables submit until the form is valid', () => {
    renderRegister();
    expect(screen.getByText('Welcome! Please enter your details to sign up.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled();
  });

  it('creates the account, stores a profile doc and redirects home', async () => {
    mockCreateUser.mockResolvedValue({ user: { uid: 'uid-1', email: 'new@example.com' } });
    renderRegister();

    await fillAndSubmit('new@example.com', 'secret1');

    expect(mockCreateUser).toHaveBeenCalledWith({}, 'new@example.com', 'secret1');
    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ email: 'new@example.com', role: 'customer' }),
    );
    expect(mockToastSuccess).toHaveBeenCalledWith('Successfully registered!');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows the firebase error message when registration fails', async () => {
    mockCreateUser.mockRejectedValue(new Error('Email already in use'));
    renderRegister();

    await fillAndSubmit('new@example.com', 'secret1');

    expect(await screen.findByText('Email already in use')).toBeInTheDocument();
    expect(mockToastError).toHaveBeenCalledWith('Email already in use');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('falls back to a generic message for non-Error rejections', async () => {
    mockCreateUser.mockRejectedValue('some string rejection');
    renderRegister();

    await fillAndSubmit('new@example.com', 'secret1');

    expect(await screen.findByText('Registration failed')).toBeInTheDocument();
    expect(mockToastError).toHaveBeenCalledWith('Registration failed');
  });

  it('navigates to the login page', async () => {
    renderRegister();
    await userEvent.click(screen.getByText('Log In'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
