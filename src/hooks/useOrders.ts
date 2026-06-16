import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { dbService } from '../services/dbService';
import { UserAuth } from '../context/AuthContext';
import type { IOrder } from '../types';

export default function useOrders() {
  const { user } = UserAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = dbService.subscribeToOrders(
      user.email,
      (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
      },
      (error) => {
        toast.error(t('common.error'));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, t]);

  return { orders, loading };
}
