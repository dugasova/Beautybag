import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import '../../../i18n';
import OrdersTab from './OrdersTab';
import type { IOrder } from '../../../types';

const baseItem = {
  id: 1,
  name: 'products.shampoo.name',
  description: 'products.shampoo.description',
  category: 'hair',
  subCategory: 'shampoo',
  raiting: 4.5,
  price: 100,
  imsrcOfImg: '',
};

const makeOrder = (overrides: Partial<IOrder> = {}): IOrder => ({
  id: 'order-12345678',
  items: [{ ...baseItem, totalQuantity: 2 }],
  totalPrice: 200,
  totalQuantity: 2,
  userId: 'user@example.com',
  createdAt: '2024-01-15T00:00:00.000Z',
  status: 'pending',
  ...overrides,
});

describe('OrdersTab', () => {
  it('shows a loader while orders are loading', () => {
    render(<OrdersTab orders={[]} loading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows an empty state when there are no orders', () => {
    render(<OrdersTab orders={[]} loading={false} />);
    expect(screen.getByText('No orders found.')).toBeInTheDocument();
  });

  it('renders order details, status badge and total', () => {
    render(<OrdersTab orders={[makeOrder()]} loading={false} />);

    expect(screen.getByText('#order-12')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText(/Total Price.*200 UAH/)).toBeInTheDocument();
  });

  it('maps shipped and delivered statuses to their labels', () => {
    render(
      <OrdersTab
        orders={[
          makeOrder({ id: 'order-shipped1', status: 'shipped' }),
          makeOrder({ id: 'order-delivr1', status: 'delivered' }),
        ]}
        loading={false}
      />
    );

    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('formats Firestore Timestamp dates', () => {
    const timestamp = Timestamp.fromDate(new Date('2024-03-10T00:00:00.000Z'));
    render(<OrdersTab orders={[makeOrder({ createdAt: timestamp })]} loading={false} />);

    expect(screen.getByText(timestamp.toDate().toLocaleDateString())).toBeInTheDocument();
  });
});
