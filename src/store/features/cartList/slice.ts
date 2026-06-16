import { createSlice } from "@reduxjs/toolkit";
import type { ICartItem } from "../../../types";

interface CartState {
  cartList: ICartItem[];
}

const initialState: CartState = {
  cartList: [],
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
    },
    removeFromCartList: (state, action) => {
      state.cartList = state.cartList.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    plusQuantity: (state, action) => {
      const item = state.cartList.find((item) => item.id === action.payload.id);
      if (item) {
        item.totalQuantity += 1;
      }
    },
    minusQuantity: (state, action) => {
      const item = state.cartList.find((item) => item.id === action.payload.id);
      if (item && item.totalQuantity > 1) {
        item.totalQuantity -= 1;
      }
    },
    clearCart: (state) => {
      state.cartList = [];
    },
    setCartList: (state, action) => {
      state.cartList = action.payload.map((item: ICartItem) => ({
        ...item,
        totalQuantity: Number(item.totalQuantity) || 1,
        price: Number(item.price) || 0
      }));
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
