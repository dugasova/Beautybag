import { createSlice } from "@reduxjs/toolkit";
import type { ICartItem } from "../../../types";

interface CartState {
  cartList: ICartItem[];
  totalPrice: number;
  totalQuantity: number;
}

const initialState: CartState = {
  cartList: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const cartListSlice = createSlice({
  name: "cartList",
  initialState,
  reducers: {
    addToCartList: (state, action) => {
      const existingItem = state.cartList.find(
        (item) => item.id === action.payload.id,
      );
      if (existingItem) {
        existingItem.totalQuantity += 1;
      } else {
        state.cartList.push({ ...action.payload, totalQuantity: 1 });
      }
      state.totalPrice += Number(action.payload.price) || 0;
      state.totalQuantity += 1;
    },
    removeFromCartList: (state, action) => {
      const itemToRemove = state.cartList.find(
        (item) => item.id === action.payload.id,
      );
      if (itemToRemove) {
        state.totalPrice -= (Number(itemToRemove.price) || 0) * (Number(itemToRemove.totalQuantity) || 1);
        state.totalQuantity -= (Number(itemToRemove.totalQuantity) || 0);
        state.cartList = state.cartList.filter(
          (item) => item.id !== action.payload.id,
        );
      }
    },
    plusQuantity: (state, action) => {
      const item = state.cartList.find((item) => item.id === action.payload.id);
      if (item) {
        item.totalQuantity += 1;
        state.totalPrice += Number(item.price) || 0;
        state.totalQuantity += 1;
      }
    },
    minusQuantity: (state, action) => {
      const item = state.cartList.find((item) => item.id === action.payload.id);
      if (item && item.totalQuantity > 1) {
        item.totalQuantity -= 1;
        state.totalPrice -= Number(item.price) || 0;
        state.totalQuantity -= 1;
      }
    },
    clearCart: (state) => {
      state.cartList = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
    setCartList: (state, action) => {
      const sanitizedList = action.payload.map((item: ICartItem) => ({
        ...item,
        totalQuantity: Number(item.totalQuantity) || 1,
        price: Number(item.price) || 0
      }));

      state.cartList = sanitizedList;
      state.totalPrice = sanitizedList.reduce((acc: number, item: ICartItem) => acc + (item.price * item.totalQuantity), 0);
      state.totalQuantity = sanitizedList.reduce((acc: number, item: ICartItem) => acc + item.totalQuantity, 0);
    },
  },
});

export const {
  addToCartList,
  removeFromCartList,
  plusQuantity,
  minusQuantity,
  clearCart,
  setCartList,
} = cartListSlice.actions;
export default cartListSlice.reducer;
