import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import '../../i18n';
import Cart from './Cart';
import { createTestStore } from '../../test/testStore';
import type { ICartItem } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

let mockUser: { email: string } | null = null;
vi.mock('../../context/AuthContext', () => ({
  UserAuth: () => ({ user: mockUser }),
}));

const mockUpdateCartList = vi.fn().mockResolvedValue(undefined);
const mockMoveFromCartToWishList = vi.fn().mockResolvedValue(undefined);
const mockUpdateCartQuantity = vi.fn().mockResolvedValue(undefined);
vi.mock('../../hooks/useFirestore', () => ({
  default: () => ({
    updateCartList: mockUpdateCartList,
    moveFromCartToWishList: mockMoveFromCartToWishList,
    updateCartQuantity: mockUpdateCartQuantity,
  }),
}));

const mockUpdateUserData = vi.fn().mockResolvedValue(undefined);
vi.mock('../../services/dbService', () => ({
  dbService: { updateUserData: (...args: unknown[]) => mockUpdateUserData(...args) },
}));

const mockToastError = vi.fn();
vi.mock('react-toastify', () => ({
  toast: { error: (...args: unknown[]) => mockToastError(...args), success: vi.fn() },
}));

const makeItem = (overrides: Partial<ICartItem> = {}): ICartItem => ({
  id: 1,
  name: 'products.shampoo.name',
  description: 'products.shampoo.description',
  category: 'hair',
  subCategory: 'shampoo',
  raiting: 4.5,
  price: 100,
  imsrcOfImg: '',
  totalQuantity: 1,
  ...overrides,
});

const renderCart = (cartList: ICartItem[]) => {
  const store = createTestStore({ cartList: { cartList } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </Provider>,
  );
};

beforeEach(() => {
  mockUser = null;
  vi.clearAllMocks();
});

describe('Cart', () => {
  it('shows the empty state when there are no items', () => {
    renderCart([]);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart items with quantity and subtotal', () => {
    renderCart([makeItem({ totalQuantity: 2 })]);
    expect(screen.getByText('Shampoo')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: 200 UAH')).toBeInTheDocument();
  });

  it('increments quantity when clicking +', async () => {
    renderCart([makeItem({ totalQuantity: 1 })]);
    await userEvent.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: 200 UAH')).toBeInTheDocument();
  });

  it('does not decrement below a quantity of 1', async () => {
    renderCart([makeItem({ totalQuantity: 1 })]);
    await userEvent.click(screen.getByRole('button', { name: '-' }));

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(mockUpdateCartQuantity).not.toHaveBeenCalled();
  });

  it('decrements quantity when above 1', async () => {
    renderCart([makeItem({ totalQuantity: 2 })]);
    await userEvent.click(screen.getByRole('button', { name: '-' }));

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('removes an item and falls back to the empty state', async () => {
    renderCart([makeItem()]);
    await userEvent.click(screen.getByRole('button', { name: 'Remove from cart' }));

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('moves an item to the wishlist and removes it from the cart', async () => {
    mockUser = { email: 'user@example.com' };
    renderCart([makeItem()]);
    await userEvent.click(screen.getByRole('button', { name: 'Move to Wishlist' }));

    expect(mockMoveFromCartToWishList).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('blocks checkout and redirects to login for guests', async () => {
    renderCart([makeItem()]);
    await userEvent.click(screen.getByRole('button', { name: 'Place Order' }));

    expect(mockToastError).toHaveBeenCalledWith('Please login to place an order');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to checkout for a logged-in user', async () => {
    mockUser = { email: 'user@example.com' };
    renderCart([makeItem()]);
    await userEvent.click(screen.getByRole('button', { name: 'Place Order' }));

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('clears the cart and syncs with firestore for a logged-in user', async () => {
    mockUser = { email: 'user@example.com' };
    renderCart([makeItem()]);
    await userEvent.click(screen.getByRole('button', { name: 'Clear Cart' }));

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(mockUpdateUserData).toHaveBeenCalledWith('user@example.com', { savedProducts: [] });
  });
});
