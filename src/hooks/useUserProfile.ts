import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { dbService } from '../services/dbService';
import { UserAuth } from '../context/AuthContext';
import type { IUserProfile, IAddress } from '../types';

export default function useUserProfile() {
  const { user } = UserAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<IUserProfile>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setProfile({});
      setLoading(false);
      return;
    }
    const unsub = dbService.subscribeToProfile(user.email, (data) => {
      setProfile(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const withErrorHandling = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error) {
      console.error("Firestore Error:", error);
      toast.error(t('common.error'));
    }
  };

  const updateProfile = async (data: IUserProfile) => {
    if (!user?.email) return;
    await withErrorHandling(() => dbService.updateUserData(user.email!, data));
  };

  const addAddress = async (address: Omit<IAddress, 'id'>) => {
    if (!user?.email) return;
    await withErrorHandling(() => dbService.addAddress(user.email!, address));
  };

  const deleteAddress = async (addressId: string) => {
    if (!user?.email) return;
    await withErrorHandling(() => dbService.deleteAddress(user.email!, addressId));
  };

  return { profile, loading, updateProfile, addAddress, deleteAddress };
}
