import { describe, it, expect } from 'vitest';
import reducer, {
  nextStep,
  prevStep,
  setShippingAddress,
  setPaymentMethod,
  setOrderId,
  setIsProcessing,
  resetCheckout,
} from './slice';
import type { IShippingAddress } from '../../../types';

const address: IShippingAddress = {
  firstName: 'Anna',
  lastName: 'Smith',
  email: 'anna@example.com',
  address: '123 Main St',
  city: 'Kyiv',
  phone: '+380501234567',
};

describe('checkout reducer', () => {
  describe('nextStep', () => {
    it('advances from step 1 to 2', () => {
      const state = reducer(undefined, nextStep());
      expect(state.currentStep).toBe(2);
    });

    it('advances from step 2 to 3', () => {
      let state = reducer(undefined, nextStep());
      state = reducer(state, nextStep());
      expect(state.currentStep).toBe(3);
    });

    it('stays at 3 when already on last step', () => {
      let state = reducer(undefined, nextStep());
      state = reducer(state, nextStep());
      state = reducer(state, nextStep());
      expect(state.currentStep).toBe(3);
    });
  });

  describe('prevStep', () => {
    it('goes back from step 2 to 1', () => {
      let state = reducer(undefined, nextStep());
      state = reducer(state, prevStep());
      expect(state.currentStep).toBe(1);
    });

    it('stays at 1 when already on first step', () => {
      const state = reducer(undefined, prevStep());
      expect(state.currentStep).toBe(1);
    });
  });

  describe('setShippingAddress', () => {
    it('updates the shipping address', () => {
      const state = reducer(undefined, setShippingAddress(address));
      expect(state.shippingAddress).toEqual(address);
    });
  });

  describe('setPaymentMethod', () => {
    it('updates payment method to cash', () => {
      const state = reducer(undefined, setPaymentMethod('cash'));
      expect(state.paymentMethod).toBe('cash');
    });

    it('updates payment method to paypal', () => {
      const state = reducer(undefined, setPaymentMethod('paypal'));
      expect(state.paymentMethod).toBe('paypal');
    });
  });

  describe('setOrderId', () => {
    it('stores the order id', () => {
      const state = reducer(undefined, setOrderId('order-abc-123'));
      expect(state.orderId).toBe('order-abc-123');
    });
  });

  describe('setIsProcessing', () => {
    it('sets isProcessing to true', () => {
      const state = reducer(undefined, setIsProcessing(true));
      expect(state.isProcessing).toBe(true);
    });

    it('sets isProcessing to false', () => {
      let state = reducer(undefined, setIsProcessing(true));
      state = reducer(state, setIsProcessing(false));
      expect(state.isProcessing).toBe(false);
    });
  });

  describe('resetCheckout', () => {
    it('returns to initial state', () => {
      let state = reducer(undefined, nextStep());
      state = reducer(state, setShippingAddress(address));
      state = reducer(state, setPaymentMethod('paypal'));
      state = reducer(state, resetCheckout());
      expect(state.currentStep).toBe(1);
      expect(state.paymentMethod).toBe('card');
      expect(state.shippingAddress.firstName).toBe('');
      expect(state.orderId).toBeNull();
    });
  });
});
