import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '../../../i18n';
import AddressesTab from './AddressesTab';
import type { IAddress } from '../../../types';

const makeAddress = (overrides: Partial<IAddress> = {}): IAddress => ({
  id: 'addr-1',
  label: 'Home',
  firstName: 'John',
  lastName: 'Doe',
  address: '123 Main St',
  city: 'Kyiv',
  phone: '+380501234567',
  ...overrides,
});

describe('AddressesTab', () => {
  it('shows an empty state when there are no saved addresses', () => {
    render(<AddressesTab addresses={[]} onDelete={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.getByText('No saved addresses yet.')).toBeInTheDocument();
  });

  it('renders saved addresses and removes one on click', async () => {
    const onDelete = vi.fn();
    render(<AddressesTab addresses={[makeAddress()]} onDelete={onDelete} onAdd={vi.fn()} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(onDelete).toHaveBeenCalledWith('addr-1');
  });

  it('validates required fields before submitting a new address', async () => {
    const onAdd = vi.fn();
    render(<AddressesTab addresses={[]} onDelete={vi.fn()} onAdd={onAdd} />);

    await userEvent.click(screen.getByRole('button', { name: '+ Add New Address' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save Address' }));

    expect(await screen.findByText('First name must be at least 2 characters')).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('submits a valid address and closes the form', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddressesTab addresses={[]} onDelete={vi.fn()} onAdd={onAdd} />);

    await userEvent.click(screen.getByRole('button', { name: '+ Add New Address' }));

    await userEvent.type(screen.getByLabelText('First Name'), 'Jane');
    await userEvent.type(screen.getByLabelText('Last Name'), 'Smith');
    await userEvent.type(screen.getByLabelText('Address'), '456 Side Street');
    await userEvent.type(screen.getByLabelText('City'), 'Lviv');
    await userEvent.type(screen.getByLabelText('Phone'), '+380671234567');

    await userEvent.click(screen.getByRole('button', { name: 'Save Address' }));

    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Side Street',
      city: 'Lviv',
      phone: '+380671234567',
    }));
    expect(screen.queryByRole('button', { name: 'Save Address' })).not.toBeInTheDocument();
  });
});
