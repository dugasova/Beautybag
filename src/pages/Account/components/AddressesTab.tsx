import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { IAddress } from '../../../types';

const addressFormSchema = (t: (key: string) => string) => z.object({
  label: z.string(),
  firstName: z.string().min(2, t('account.addresses.validation.firstNameMin')),
  lastName: z.string().min(2, t('account.addresses.validation.lastNameMin')),
  address: z.string().min(5, t('account.addresses.validation.addressMin')),
  city: z.string().min(2, t('account.addresses.validation.cityMin')),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, t('account.addresses.validation.phoneInvalid')),
});

type AddressFormValues = z.infer<ReturnType<typeof addressFormSchema>>;

const emptyAddr: AddressFormValues = {
  label: '', firstName: '', lastName: '', address: '', city: '', phone: '',
};

const addressFields = ['label', 'firstName', 'lastName', 'address', 'city', 'phone'] as const;

interface AddressesTabProps {
  addresses: IAddress[];
  onDelete: (addressId: string) => void;
  onAdd: (address: Omit<IAddress, 'id'>) => Promise<void>;
}

export default function AddressesTab({ addresses, onDelete, onAdd }: AddressesTabProps) {
  const { t } = useTranslation();
  const [showAddrForm, setShowAddrForm] = useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema(t)),
    defaultValues: emptyAddr,
  });

  const onSubmit = async (data: AddressFormValues) => {
    await onAdd(data);
    reset(emptyAddr);
    setShowAddrForm(false);
  };

  const handleCancel = () => {
    reset(emptyAddr);
    setShowAddrForm(false);
  };

  return (
    <div className="addresses-section">
      {addresses.length === 0 && !showAddrForm && (
        <p className="no-orders">{t('account.addresses.empty')}</p>
      )}

      <div className="addresses-list">
        {addresses.map(({ id, label, firstName, lastName, address, city, phone }) => (
          <div key={id} className="address-card">
            <div className="address-label">{label || t('account.addresses.defaultLabel')}</div>
            <p>{firstName} {lastName}</p>
            <p>{address}, {city}</p>
            <p>{phone}</p>
            <button className="delete-addr-btn" onClick={() => onDelete(id)} aria-label={`${t('account.addresses.remove')} ${label || t('account.addresses.defaultLabel')}`}>
              {t('account.addresses.remove')}
            </button>
          </div>
        ))}
      </div>

      {!showAddrForm ? (
        <button className="add-addr-btn" onClick={() => setShowAddrForm(true)}>
          {t('account.addresses.addNew')}
        </button>
      ) : (
        <form className="address-form" onSubmit={handleSubmit(onSubmit)}>
          <h3>{t('account.addresses.newAddress')}</h3>
          <div className="addr-form-grid">
            {addressFields.map(field => {
              const fieldId = `address-${field}`;
              const errorId = `${fieldId}-error`;
              return (
                <div key={field} className={`profile-field ${['address', 'label'].includes(field) ? 'full' : ''}`}>
                  <label htmlFor={fieldId}>{t(`account.addresses.fields.${field}`)}</label>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field: controllerField }) => (
                      <input
                        {...controllerField}
                        id={fieldId}
                        placeholder={field === 'label' ? t('account.addresses.labelPlaceholder') : ''}
                        className={errors[field] ? 'error' : ''}
                        aria-invalid={!!errors[field]}
                        aria-describedby={errors[field] ? errorId : undefined}
                      />
                    )}
                  />
                  {errors[field] && <span id={errorId} className="error-text" role="alert">{errors[field]?.message}</span>}
                </div>
              );
            })}
          </div>
          <div className="addr-form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>{t('account.addresses.cancel')}</button>
            <button type="submit" className="save-btn">{t('account.addresses.save')}</button>
          </div>
        </form>
      )}
    </div>
  );
}
