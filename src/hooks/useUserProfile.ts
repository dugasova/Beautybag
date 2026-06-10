import { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { UserAuth } from '../context/AuthContext';
import type { IUserProfile } from '../types';

export default function useUserProfile() {
  const { user } = UserAuth();
  const [profile, setProfile] = useState<IUserProfile>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const unsub = dbService.subscribeToProfile(user.email, (data) => {
      setProfile(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const updateProfile = async (data: IUserProfile) => {
    if (!user?.email) return;
    await dbService.updateProfile(user.email, data);
  };

  const addAddress = async (address: Omit<import('../types').IAddress, 'id'>) => {
    if (!user?.email) return;
    await dbService.addAddress(user.email, address);
  };

  const deleteAddress = async (addressId: string) => {
    if (!user?.email) return;
    await dbService.deleteAddress(user.email, addressId);
  };

  return { profile, loading, updateProfile, addAddress, deleteAddress };
}
