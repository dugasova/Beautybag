import { useState, useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { User } from 'firebase/auth';
import { storage } from '../../../firebase';
import type { IUserProfile } from '../../../types';

const profileFormSchema = (t: (key: string) => string) => z.object({
  displayName: z.union([z.literal(''), z.string().min(2, t('account.profile.validation.displayNameMin'))]),
  phone: z.union([z.literal(''), z.string().regex(/^\+?[\d\s\-()]{10,15}$/, t('account.profile.validation.phoneInvalid'))]),
});

type ProfileFormValues = z.infer<ReturnType<typeof profileFormSchema>>;

interface ProfileTabProps {
  user: User | null;
  profile: IUserProfile;
  updateProfile: (data: IUserProfile) => Promise<void>;
}

export default function ProfileTab({ user, profile, updateProfile }: ProfileTabProps) {
  const { t } = useTranslation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema(t)),
    defaultValues: {
      displayName: profile.displayName || '',
      phone: profile.phone || '',
    },
  });

  useEffect(() => {
    reset({ displayName: profile.displayName || '', phone: profile.phone || '' });
  }, [profile.displayName, profile.phone, reset]);

  const avatarSrc = avatarPreview || profile.avatarUrl;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileRef.current?.click();
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.email) return;
    setSaving(true);
    let avatarUrl = profile.avatarUrl;
    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${user.email}`);
      await uploadBytes(storageRef, avatarFile);
      avatarUrl = await getDownloadURL(storageRef);
    }
    await updateProfile({ ...data, avatarUrl });
    setSaving(false);
  };

  return (
    <div className="profile-section">
      <div
        className="avatar-upload-area"
        role="button"
        tabIndex={0}
        aria-label={t('account.profile.changeAvatar')}
        onClick={() => fileRef.current?.click()}
        onKeyDown={handleAvatarKeyDown}
      >
        {avatarSrc
          ? <img src={avatarSrc} alt="" className="avatar-preview" />
          : <div className="avatar-placeholder-lg">{user?.email?.[0].toUpperCase()}</div>
        }
        <span className="avatar-hint">{t('account.profile.avatarHint')}</span>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} aria-hidden="true" tabIndex={-1} />
      </div>

      <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-field">
          <label htmlFor="profile-displayName">{t('account.profile.displayName')}</label>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="profile-displayName"
                placeholder={t('account.profile.displayNamePlaceholder')}
                className={errors.displayName ? 'error' : ''}
                aria-invalid={!!errors.displayName}
                aria-describedby={errors.displayName ? 'profile-displayName-error' : undefined}
              />
            )}
          />
          {errors.displayName && <span id="profile-displayName-error" className="error-text" role="alert">{errors.displayName.message}</span>}
        </div>
        <div className="profile-field">
          <label htmlFor="profile-phone">{t('account.profile.phone')}</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="profile-phone"
                placeholder={t('account.profile.phonePlaceholder')}
                className={errors.phone ? 'error' : ''}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'profile-phone-error' : undefined}
              />
            )}
          />
          {errors.phone && <span id="profile-phone-error" className="error-text" role="alert">{errors.phone.message}</span>}
        </div>
        <div className="profile-field">
          <label htmlFor="profile-email">{t('account.profile.email')}</label>
          <input id="profile-email" value={user?.email || ''} readOnly className="readonly-field" />
        </div>
        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? t('account.profile.saving') : t('account.profile.save')}
        </button>
      </form>
    </div>
  );
}
