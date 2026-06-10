import { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { UserAuth } from '../context/AuthContext';
import type { IOrder } from '../types';

export default function UseOrders() {
  const { user } = UserAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (user?.email) {
      const unsubscribe = dbService.subscribeToOrders(user.email, (fetchedOrders) => {
        setOrders(fetchedOrders);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return orders;
}
