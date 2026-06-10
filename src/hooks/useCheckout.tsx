import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { setShippingAddress, nextStep } from '../store/features/checkout/slice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const ShippingStepSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Phone must be 10-15 digits'),
});

type ShippingFormValues = z.infer<typeof ShippingStepSchema>;

export default function useCheckout() {
  const dispatch = useDispatch();
  const shippingAddress = useSelector((state: RootState) => state.checkout.shippingAddress);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<ShippingFormValues>({
    resolver: zodResolver(ShippingStepSchema),
    defaultValues: {
      firstName: shippingAddress.firstName || '',
      lastName: shippingAddress.lastName || '',
      email: shippingAddress.email || '',
      address: shippingAddress.address || '',
      city: shippingAddress.city || '',
      phone: shippingAddress.phone || '',
    },
  });

  const onSubmit = (data: ShippingFormValues) => {
    dispatch(setShippingAddress(data));
    dispatch(nextStep());
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    formState: { errors },
    setValue,
  };
}
