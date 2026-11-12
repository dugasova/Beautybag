import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { dbService } from '../services/dbService';
import { UserAuth } from '../context/AuthContext';
import type { IUserProfile, IAddress } from '../types';

const EMPTY_PROFILE: IUserProfile = {};

// Same approach as useOrders: keep the snapshot with its email and derive the rest during render.
interface ProfileSnapshot {
  email: string;
  profile: IUserProfile;
}

export default function useUserProfile() {
  const { user } = UserAuth();
  const email = user?.email;
  const { t } = useTranslation();
  const [snapshot, setSnapshot] = useState<ProfileSnapshot | null>(null);

  useEffect(() => {
    if (!email) return;
    const unsub = dbService.subscribeToProfile(email, (profile) => setSnapshot({ email, profile }));
    return () => unsub();
  }, [email]);

  const current = snapshot?.email === email ? snapshot : null;
  const profile = current?.profile ?? EMPTY_PROFILE;
  const loading = Boolean(email) && !current;

  const withErrorHandling = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch {
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
