import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '../../i18n';
import ProductPage from './ProductPage';
import { createTestStore } from '../../test/testStore';
import type { IProduct } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockFetchAllProducts = vi.fn().mockResolvedValue([]);
vi.mock('../../services/dbService', () => ({
  dbService: { fetchAllProducts: (...args: unknown[]) => mockFetchAllProducts(...args) },
}));

const product: IProduct = {
  id: 1,
  name: 'products.shampoo.name',
  description: 'products.shampoo.description',
  category: 'hair',
  subCategory: 'shampoo',
  raiting: 4.5,
  price: 100,
  imsrcOfImg: '',
};

const renderProductPage = (goodsStatus: 'idle' | 'loading' | 'succeeded' | 'failed', productId = '1') => {
  const store = createTestStore({
    goods: { items: goodsStatus === 'succeeded' ? [product] : [], status: goodsStatus, error: null },
  });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/product/${productId}`]}>
        <Routes>
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return store;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ProductPage', () => {
  it('shows a loader while goods are still loading', () => {
    renderProductPage('loading');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Product Not Found')).not.toBeInTheDocument();
  });

  it('shows an error state with retry that re-dispatches the goods request', async () => {
    renderProductPage('failed');
    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(mockFetchAllProducts).toHaveBeenCalledTimes(1);
  });

  it('shows "not found" only once goods have loaded and the id does not match', () => {
    renderProductPage('succeeded', '999');
    expect(screen.getByText('Product Not Found')).toBeInTheDocument();
  });

  it('navigates home from the not-found state', async () => {
    renderProductPage('succeeded', '999');
    await userEvent.click(screen.getByRole('button', { name: 'Back to Home' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders product details when found', () => {
    renderProductPage('succeeded', '1');
    expect(screen.getByRole('heading', { name: 'Shampoo' })).toBeInTheDocument();
    expect(screen.getByText('100 UAH')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
  });

  it('adds the product to the cart and reflects the quantity', async () => {
    const store = renderProductPage('succeeded', '1');

    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    expect(store.getState().cartList.cartList).toHaveLength(1);
    expect(await screen.findByRole('button', { name: 'Add to cart (1)' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Add to cart (1)' }));
    expect(store.getState().cartList.cartList[0].totalQuantity).toBe(2);
  });

  it('toggles the wishlist state', async () => {
    const store = renderProductPage('succeeded', '1');

    const wishlistButton = document.querySelector('.wishlist-toggle-btn') as HTMLButtonElement;
    await userEvent.click(wishlistButton);
    expect(store.getState().wishList.wishList).toHaveLength(1);

    await userEvent.click(wishlistButton);
    expect(store.getState().wishList.wishList).toHaveLength(0);
  });
});
