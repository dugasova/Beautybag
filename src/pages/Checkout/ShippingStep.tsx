import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setShippingAddress, nextStep } from '../../store/features/checkout/slice';
import { UserAuth } from '../../context/AuthContext';
import useUserProfile from '../../hooks/useUserProfile';
import type { IAddress } from '../../types';
import Button from '../../components/ui/Button/Button';
import { ShippingStepSchema, type ShippingFormValues } from '../../hooks/useCheckout';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ShippingStep() {
  const dispatch = useDispatch();
  const { user } = UserAuth();
  const { profile } = useUserProfile();
  const shippingAddress = useSelector((state: RootState) => state.checkout.shippingAddress);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<ShippingFormValues>({
    resolver: zodResolver(ShippingStepSchema),
    defaultValues: {
      firstName: shippingAddress.firstName || '',
      lastName: shippingAddress.lastName || '',
      email: shippingAddress.email || user?.email || '',
      address: shippingAddress.address || '',
      city: shippingAddress.city || '',
      phone: shippingAddress.phone || '',
    },
  });

  // This is the key: called ONLY when validation passes
  const onSubmit = (data: ShippingFormValues) => {
    dispatch(setShippingAddress(data)); // Save validated data to Redux
    dispatch(nextStep());               // Then move to the next step
  };

  const handleUseSavedAddress = (address: IAddress) => {
    setValue('firstName', address.firstName);
    setValue('lastName', address.lastName);
    setValue('address', address.address);
    setValue('city', address.city);
    setValue('phone', address.phone);
  };

  return (
    <div className="checkout-step-content">
      <h2>Shipping Address</h2>

      {profile.addresses && profile.addresses.length > 0 && (
        <div className="saved-addresses-selector">
          <h3>Use saved address:</h3>
          <div className="saved-addresses-list">
            {profile.addresses.map(addr => (
              <div
                key={addr.id}
                className="saved-address-chip"
                onClick={() => handleUseSavedAddress(addr)}
              >
                <strong>{addr.label}</strong>
                <span>{addr.address}, {addr.city}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Use react-hook-form's handleSubmit, which runs validation first */}
      <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
        <div className="form-group">
          <label>First Name</label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="First name"
                id="firstName"
                {...field}
                className={errors.firstName ? 'error' : ''}
              />
            )}
          />
          {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Last name"
                id="lastName"
                {...field}
                className={errors.lastName ? 'error' : ''}
              />
            )}
          />
          {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
        </div>
        <div className="form-group full-width">
          <label>Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                type="email"
                placeholder="Email"
                id="email"
                {...field}
                readOnly
                className='form-group__email'
              />
            )}
          />
        </div>
        <div className="form-group full-width">
          <label>Address</label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Address"
                id="address"
                {...field}
                className={errors.address ? 'error' : ''}
              />
            )}
          />
          {errors.address && <span className="error-text">{errors.address.message}</span>}
        </div>
        <div className="form-group full-width">
          <label>City</label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="City"
                id="city"
                {...field}
                className={errors.city ? 'error' : ''}
              />
            )}
          />
          {errors.city && <span className="error-text">{errors.city.message}</span>}
        </div>
        <div className="form-group full-width">
          <label>Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                placeholder="Phone"
                id="phone"
                {...field}
                className={errors.phone ? 'error' : ''}
              />
            )}
          />
          {errors.phone && <span className="error-text">{errors.phone.message}</span>}
        </div>
        <div className="checkout-actions">
          <div /> {/* Spacer */}
          <Button type="submit" variant="purple" size="md">Continue to Payment</Button>
        </div>
      </form>
    </div>
  );
}
