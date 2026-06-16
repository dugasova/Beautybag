import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setShippingAddress, nextStep } from '../../store/features/checkout/slice';
import { UserAuth } from '../../context/AuthContext';
import useUserProfile from '../../hooks/useUserProfile';
import type { IAddress } from '../../types';
import Button from '../../components/ui/Button/Button';
import { ShippingStepSchema, type ShippingFormValues } from '../../hooks/useCheckout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import SavedAddressSelector from './SavedAddressSelector';
import FormField from './FormField';

export default function ShippingStep() {
  const { t } = useTranslation();
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

  const onSubmit = (data: ShippingFormValues) => {
    dispatch(setShippingAddress(data));
    dispatch(nextStep());
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
      <h2>{t('checkout.shipping.title')}</h2>

      {profile.addresses && profile.addresses.length > 0 && (
        <SavedAddressSelector addresses={profile.addresses} onSelect={handleUseSavedAddress} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
        <FormField name="firstName" control={control} label={t('checkout.shipping.firstName')} error={errors.firstName} />
        <FormField name="lastName"  control={control} label={t('checkout.shipping.lastName')}  error={errors.lastName} />
        <FormField name="email"     control={control} label={t('checkout.shipping.email')}     type="email" readOnly wrapperClassName="full-width" />
        <FormField name="address"   control={control} label={t('checkout.shipping.address')}   error={errors.address} wrapperClassName="full-width" />
        <FormField name="city"      control={control} label={t('checkout.shipping.city')}      error={errors.city}    wrapperClassName="full-width" />
        <FormField name="phone"     control={control} label={t('checkout.shipping.phone')}     error={errors.phone}   wrapperClassName="full-width" />
        <div className="checkout-actions">
          <Button type="submit" variant="purple" size="md" style={{ marginLeft: 'auto' }}>
            {t('checkout.shipping.continue')}
          </Button>
        </div>
      </form>
    </div>
  );
}
