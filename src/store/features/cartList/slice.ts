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

function recalcTotals(state: CartState) {
  state.totalPrice = state.cartList.reduce((acc, i) => acc + i.price * i.totalQuantity, 0);
  state.totalQuantity = state.cartList.reduce((acc, i) => acc + i.totalQuantity, 0);
}

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
      recalcTotals(state);
    },
    removeFromCartList: (state, action) => {
      state.cartList = state.cartList.filter(
        (item) => item.id !== action.payload.id,
      );
      recalcTotals(state);
    },
    plusQuantity: (state, action) => {
      const item = state.cartList.find((item) => item.id === action.payload.id);
      if (item) {
        item.totalQuantity += 1;
        recalcTotals(state);
      }
    },
    minusQuantity: (state, action) => {
      const item = state.cartList.find((item) => item.id === action.payload.id);
      if (item && item.totalQuantity > 1) {
        item.totalQuantity -= 1;
        recalcTotals(state);
      }
    },
    clearCart: (state) => {
      state.cartList = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
    setCartList: (state, action) => {
      state.cartList = action.payload.map((item: ICartItem) => ({
        ...item,
        totalQuantity: Number(item.totalQuantity) || 1,
        price: Number(item.price) || 0
      }));
      recalcTotals(state);
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
