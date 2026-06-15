import { useState, useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { User } from 'firebase/auth';
import { storage } from '../../../firebase';
import type { IUserProfile } from '../../../types';

const profileFormSchema = z.object({
  displayName: z.union([z.literal(''), z.string().min(2, 'Display name must be at least 2 characters')]),
  phone: z.union([z.literal(''), z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Phone must be 10-15 digits')]),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileTabProps {
  user: User | null;
  profile: IUserProfile;
  updateProfile: (data: IUserProfile) => Promise<void>;
}

export default function ProfileTab({ user, profile, updateProfile }: ProfileTabProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
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
      <div className="avatar-upload-area" onClick={() => fileRef.current?.click()}>
        {avatarSrc
          ? <img src={avatarSrc} alt="avatar" className="avatar-preview" />
          : <div className="avatar-placeholder-lg">{user?.email?.[0].toUpperCase()}</div>
        }
        <span className="avatar-hint">Click to change photo</span>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
      </div>

      <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-field">
          <label>Display Name</label>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <input {...field} placeholder="Your name" className={errors.displayName ? 'error' : ''} />
            )}
          />
          {errors.displayName && <span className="error-text">{errors.displayName.message}</span>}
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input {...field} placeholder="+380..." className={errors.phone ? 'error' : ''} />
            )}
          />
          {errors.phone && <span className="error-text">{errors.phone.message}</span>}
        </div>
        <div className="profile-field">
          <label>Email</label>
          <input value={user?.email || ''} readOnly className="readonly-field" />
        </div>
        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
