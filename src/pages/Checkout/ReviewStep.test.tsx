import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n';
import ReviewStep from './ReviewStep';
import { createTestStore } from '../../test/testStore';
import type { ICartItem, IShippingAddress } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSendOrder = vi.fn();
vi.mock('../../hooks/useFirestore', () => ({
  default: () => ({ sendOrder: (...args: unknown[]) => mockSendOrder(...args) }),
}));

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
vi.mock('react-toastify', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const cartItem: ICartItem = {
  id: 1,
  name: 'products.shampoo.name',
  description: 'products.shampoo.description',
  category: 'hair',
  subCategory: 'shampoo',
  raiting: 4.5,
  price: 100,
  imsrcOfImg: '',
  totalQuantity: 2,
};

const shippingAddress: IShippingAddress = {
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  address: '1 Main St',
  city: 'Kyiv',
  phone: '+380501234567',
};

const renderReviewStep = () => {
  const store = createTestStore({
    cartList: { cartList: [cartItem] },
    checkout: {
      currentStep: 3,
      shippingAddress,
      paymentMethod: 'card',
      isProcessing: false,
      orderId: null,
    },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ReviewStep />
      </MemoryRouter>
    </Provider>,
  );
  return store;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ReviewStep', () => {
  it('renders the shipping, payment and item summary', () => {
    renderReviewStep();

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('1 Main St, Kyiv')).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
    expect(screen.getByText('Shampoo x 2')).toBeInTheDocument();
  });

  it('places the order, clears the cart and navigates on success', async () => {
    mockSendOrder.mockResolvedValue('order-123');
    const store = renderReviewStep();

    await userEvent.click(screen.getByRole('button', { name: 'Place Order' }));

    expect(await screen.findByRole('button', { name: 'Place Order' })).toBeEnabled();
    expect(mockSendOrder).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/order-success');
    expect(mockToastSuccess).toHaveBeenCalledWith('Order placed successfully!');
    expect(store.getState().cartList.cartList).toHaveLength(0);
    expect(store.getState().checkout.orderId).toBe('order-123');
  });

  it('shows an error and keeps the cart when placing the order fails', async () => {
    mockSendOrder.mockRejectedValue(new Error('network error'));
    const store = renderReviewStep();

    await userEvent.click(screen.getByRole('button', { name: 'Place Order' }));

    expect(await screen.findByRole('button', { name: 'Place Order' })).toBeEnabled();
    expect(mockToastError).toHaveBeenCalledWith('Failed to place order');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(store.getState().cartList.cartList).toHaveLength(1);
  });

  it('disables the actions while processing', async () => {
    let resolveOrder: (value: string) => void = () => {};
    mockSendOrder.mockReturnValue(
      new Promise((resolve) => {
        resolveOrder = resolve;
      }),
    );
    renderReviewStep();

    await userEvent.click(screen.getByRole('button', { name: 'Place Order' }));
    expect(screen.getByRole('button', { name: 'Processing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

    resolveOrder('order-999');
    await screen.findByRole('button', { name: 'Place Order' });
  });
});
