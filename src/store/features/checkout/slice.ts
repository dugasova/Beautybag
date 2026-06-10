import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ICheckoutState, IShippingAddress } from '../../../types';

const initialState: ICheckoutState = {
  currentStep: 1,
  shippingAddress: {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  },
  paymentMethod: 'card',
  isProcessing: false,
  orderId: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep -= 1;
    },
    setShippingAddress: (state, action: PayloadAction<IShippingAddress>) => {
      state.shippingAddress = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<'card' | 'cash' | 'paypal'>) => {
      state.paymentMethod = action.payload;
    },
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
    resetCheckout: () => {
      return initialState;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
  },
});

export const {
  nextStep,
  prevStep,
  setShippingAddress,
  setPaymentMethod,
  setOrderId,
  resetCheckout,
  setIsProcessing,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
