import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { dbService } from '../services/dbService';
import { UserAuth } from '../context/AuthContext';
import type { IOrder } from '../types';

const NO_ORDERS: IOrder[] = [];

// Snapshot results are stored together with the email they belong to. "No user" and
// "still loading for this user" are then derived during render, without setState in the effect.
interface OrdersSnapshot {
  email: string;
  orders: IOrder[];
}

export default function useOrders() {
  const { user } = UserAuth();
  const email = user?.email;
  const { t } = useTranslation();
  const [snapshot, setSnapshot] = useState<OrdersSnapshot | null>(null);

  useEffect(() => {
    if (!email) return;

    const unsubscribe = dbService.subscribeToOrders(
      email,
      (orders) => setSnapshot({ email, orders }),
      () => {
        toast.error(t('common.error'));
        // Stop loading, keep whatever was already loaded for this user.
        setSnapshot((prev) => ({ email, orders: prev?.email === email ? prev.orders : NO_ORDERS }));
      },
    );

    return () => unsubscribe();
  }, [email, t]);

  const current = snapshot?.email === email ? snapshot : null;
  return {
    orders: current?.orders ?? NO_ORDERS,
    loading: Boolean(email) && !current,
  };
}
