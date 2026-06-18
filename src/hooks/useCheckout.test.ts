import { describe, it, expect } from 'vitest';
import { ShippingStepSchema } from './useCheckout';

const validData = {
  firstName: 'Anna',
  lastName: 'Smith',
  email: 'anna@example.com',
  address: '123 Main Street',
  city: 'Kyiv',
  phone: '+380501234567',
};

const expectError = (data: object, field: string, message: string) => {
  const result = ShippingStepSchema.safeParse(data);
  expect(result.success).toBe(false);
  if (!result.success) {
    const fieldError = result.error.issues.find((i) => i.path[0] === field);
    expect(fieldError).toBeDefined();
    expect(fieldError!.message).toBe(message);
  }
};

describe('ShippingStepSchema', () => {
  it('accepts valid data', () => {
    const result = ShippingStepSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe('firstName', () => {
    it('rejects empty string', () => {
      expectError({ ...validData, firstName: '' }, 'firstName', 'First name must be at least 2 characters');
    });

    it('rejects single character', () => {
      expectError({ ...validData, firstName: 'A' }, 'firstName', 'First name must be at least 2 characters');
    });

    it('accepts 2 characters', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, firstName: 'Ab' });
      expect(result.success).toBe(true);
    });
  });

  describe('lastName', () => {
    it('rejects empty string', () => {
      expectError({ ...validData, lastName: '' }, 'lastName', 'Last name must be at least 2 characters');
    });

    it('rejects single character', () => {
      expectError({ ...validData, lastName: 'S' }, 'lastName', 'Last name must be at least 2 characters');
    });

    it('accepts 2 characters', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, lastName: 'Li' });
      expect(result.success).toBe(true);
    });
  });

  describe('email', () => {
    it('rejects invalid email', () => {
      expectError({ ...validData, email: 'not-an-email' }, 'email', 'Invalid email address');
    });

    it('rejects empty string', () => {
      expectError({ ...validData, email: '' }, 'email', 'Invalid email address');
    });

    it('accepts valid email', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, email: 'test@mail.com' });
      expect(result.success).toBe(true);
    });
  });

  describe('address', () => {
    it('rejects string shorter than 5 characters', () => {
      expectError({ ...validData, address: '12' }, 'address', 'Address must be at least 5 characters');
    });

    it('rejects empty string', () => {
      expectError({ ...validData, address: '' }, 'address', 'Address must be at least 5 characters');
    });

    it('accepts 5 characters', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, address: '12345' });
      expect(result.success).toBe(true);
    });
  });

  describe('city', () => {
    it('rejects single character', () => {
      expectError({ ...validData, city: 'K' }, 'city', 'City must be at least 2 characters');
    });

    it('accepts 2 characters', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, city: 'LA' });
      expect(result.success).toBe(true);
    });
  });

  describe('phone', () => {
    it('rejects too short number', () => {
      expectError({ ...validData, phone: '12345' }, 'phone', 'Phone must be 10-15 digits');
    });

    it('rejects letters', () => {
      expectError({ ...validData, phone: 'abcdefghijk' }, 'phone', 'Phone must be 10-15 digits');
    });

    it('accepts phone with + prefix', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, phone: '+380501234567' });
      expect(result.success).toBe(true);
    });

    it('accepts phone without + prefix', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, phone: '0501234567' });
      expect(result.success).toBe(true);
    });

    it('accepts phone with spaces and dashes', () => {
      const result = ShippingStepSchema.safeParse({ ...validData, phone: '+38 (050) 123-45' });
      expect(result.success).toBe(true);
    });

    it('rejects phone longer than 15 characters', () => {
      expectError({ ...validData, phone: '+1234567890123456' }, 'phone', 'Phone must be 10-15 digits');
    });
  });

  it('reports multiple errors at once', () => {
    const result = ShippingStepSchema.safeParse({
      firstName: '',
      lastName: '',
      email: 'bad',
      address: '',
      city: '',
      phone: '123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(6);
    }
  });
});
