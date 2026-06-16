import { z } from 'zod';

export const ShippingStepSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email({ error: 'Invalid email address' }),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,15}$/, 'Phone must be 10-15 digits'),
});

export type ShippingFormValues = z.infer<typeof ShippingStepSchema>;
