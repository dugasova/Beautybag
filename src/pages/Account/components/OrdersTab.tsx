import { Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import PageLoader from '../../../components/ui/PageLoader/PageLoader';
import type { IOrder } from '../../../types';

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Processing', cls: 'status-pending' },
  processing: { label: 'Processing', cls: 'status-pending' },
  shipped: { label: 'Shipped', cls: 'status-shipped' },
  delivered: { label: 'Delivered', cls: 'status-delivered' },
};

interface OrdersTabProps {
  orders: IOrder[];
  loading: boolean;
}

export default function OrdersTab({ orders, loading }: OrdersTabProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="orders-section">
        <PageLoader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-section">
        <p className="no-orders">{t('account.noOrders')}</p>
      </div>
    );
  }

  return (
    <div className="orders-section">
      <div className="orders-list">
        {orders.map(({ id, status, createdAt, items, totalPrice }) => {
          const { label, cls } = statusConfig[status || 'pending'];
          return (
            <div key={id!} className="order-card">
              <div className="order-header">
                <span className="order-id">#{id?.slice(0, 8)}</span>
                <span className={`order-status ${cls}`}>{label}</span>
                <span className="order-date">
                  {createdAt instanceof Timestamp
                    ? createdAt.toDate().toLocaleDateString()
                    : new Date(createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="order-items">
                {items.map(({ name, totalQuantity, price }, idx) => (
                  <div key={idx} className="order-item-row">
                    <span>{t(name)} × {totalQuantity || 1}</span>
                    <span>{(Number(price) || 0) * (Number(totalQuantity) || 1)} UAH</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <strong>{t('cart.totalPrice') || 'Total'}: {Number(totalPrice) || 0} UAH</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
