import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import '../../i18n';
import ShippingStep from './ShippingStep';
import { createTestStore } from '../../test/testStore';
import type { IUserProfile } from '../../types';

vi.mock('../../context/AuthContext', () => ({
  UserAuth: () => ({ user: { email: 'user@example.com' } }),
}));

let mockProfile: IUserProfile = {};
vi.mock('../../hooks/useUserProfile', () => ({
  default: () => ({ profile: mockProfile }),
}));

const renderShippingStep = () => {
  const store = createTestStore();
  render(
    <Provider store={store}>
      <ShippingStep />
    </Provider>,
  );
  return store;
};

describe('ShippingStep', () => {
  it('pre-fills the email from the logged-in user', () => {
    mockProfile = {};
    renderShippingStep();
    expect(screen.getByLabelText('Email')).toHaveValue('user@example.com');
  });

  it('shows validation errors when submitting an empty form', async () => {
    mockProfile = {};
    renderShippingStep();

    await userEvent.click(screen.getByRole('button', { name: 'Continue to Payment' }));

    expect(await screen.findByText('First name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Last name must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Address must be at least 5 characters')).toBeInTheDocument();
    expect(screen.getByText('City must be at least 2 characters')).toBeInTheDocument();
    expect(screen.getByText('Phone must be 10-15 digits')).toBeInTheDocument();
  });

  it('does not show the saved-address selector when there are no saved addresses', () => {
    mockProfile = {};
    renderShippingStep();
    expect(screen.queryByText('Use saved address:')).not.toBeInTheDocument();
  });

  it('fills the form from a saved address', async () => {
    mockProfile = {
      addresses: [
        {
          id: 'addr-1',
          label: 'Home',
          firstName: 'Alice',
          lastName: 'Smith',
          address: '1 Main St',
          city: 'Kyiv',
          phone: '+380501234567',
        },
      ],
    };
    renderShippingStep();

    await userEvent.click(screen.getByText('Home'));

    expect(screen.getByLabelText('First Name')).toHaveValue('Alice');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Smith');
    expect(screen.getByLabelText('Address')).toHaveValue('1 Main St');
    expect(screen.getByLabelText('City')).toHaveValue('Kyiv');
    expect(screen.getByLabelText('Phone')).toHaveValue('+380501234567');
  });

  it('dispatches the shipping address and advances to the next step on valid submit', async () => {
    mockProfile = {};
    const store = renderShippingStep();

    await userEvent.type(screen.getByLabelText('First Name'), 'Alice');
    await userEvent.type(screen.getByLabelText('Last Name'), 'Smith');
    await userEvent.type(screen.getByLabelText('Address'), '1 Main Street');
    await userEvent.type(screen.getByLabelText('City'), 'Kyiv');
    await userEvent.type(screen.getByLabelText('Phone'), '+380501234567');

    await userEvent.click(screen.getByRole('button', { name: 'Continue to Payment' }));

    await waitFor(() => {
      expect(store.getState().checkout.currentStep).toBe(2);
    });
    expect(store.getState().checkout.shippingAddress).toMatchObject({
      firstName: 'Alice',
      lastName: 'Smith',
      address: '1 Main Street',
      city: 'Kyiv',
      phone: '+380501234567',
    });
  });
});
