import type { Timestamp } from 'firebase/firestore';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  raiting: number;
  volume?: number;
  price: number;
  discount?: number;
  discountPrice?: number;
  imsrcOfImg: string;
}

export interface ICartItem extends IProduct {
  totalQuantity: number;
}

export interface ICategory {
  id: number;
  name: string;
  subCategories: string[];
}

export interface ISubCategory {
  id: number;
  name: string;
  products: IProduct[];
}

export interface IAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
}

export interface IUserProfile {
  displayName?: string;
  phone?: string;
  avatarUrl?: string;
  addresses?: IAddress[];
}

export interface IUserDocument extends IUserProfile {
  wishList?: IProduct[];
  savedProducts?: ICartItem[];
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode?: string;
  phone: string;
}

export interface ICheckoutState {
  currentStep: number;
  shippingAddress: IShippingAddress;
  paymentMethod: 'card' | 'cash' | 'paypal';
  isProcessing: boolean;
  orderId: string | null;
}

export interface IOrder {
  id?: string;
  items: ICartItem[];
  totalPrice: number;
  totalQuantity: number;
  userId: string;
  createdAt: Timestamp | string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress?: IShippingAddress;
  paymentMethod?: string;
}
