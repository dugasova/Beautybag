import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { IAddress } from '../../../types';

const addressFormSchema = z.object({
  label: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Phone must be 10-15 digits'),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

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
  const [showAddrForm, setShowAddrForm] = useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
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
        <p className="no-orders">No saved addresses yet.</p>
      )}

      <div className="addresses-list">
        {addresses.map(({ id, label, firstName, lastName, address, city, phone }) => (
          <div key={id} className="address-card">
            <div className="address-label">{label || 'Address'}</div>
            <p>{firstName} {lastName}</p>
            <p>{address}, {city}</p>
            <p>{phone}</p>
            <button className="delete-addr-btn" onClick={() => onDelete(id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {!showAddrForm ? (
        <button className="add-addr-btn" onClick={() => setShowAddrForm(true)}>
          + Add New Address
        </button>
      ) : (
        <form className="address-form" onSubmit={handleSubmit(onSubmit)}>
          <h3>New Address</h3>
          <div className="addr-form-grid">
            {addressFields.map(field => (
              <div key={field} className={`profile-field ${['address', 'label'].includes(field) ? 'full' : ''}`}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: controllerField }) => (
                    <input
                      {...controllerField}
                      placeholder={field === 'label' ? 'e.g. Home, Work' : ''}
                      className={errors[field] ? 'error' : ''}
                    />
                  )}
                />
                {errors[field] && <span className="error-text">{errors[field]?.message}</span>}
              </div>
            ))}
          </div>
          <div className="addr-form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="save-btn">Save Address</button>
          </div>
        </form>
      )}
    </div>
  );
}
