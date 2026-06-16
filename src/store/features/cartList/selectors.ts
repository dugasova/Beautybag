import type { RootState } from "../../store";

export const selectCartList = (state: RootState) => state.cartList.cartList;

export const selectTotalPrice = (state: RootState) =>
  state.cartList.cartList.reduce((acc, i) => acc + (i.discountPrice ?? i.price) * i.totalQuantity, 0);

export const selectTotalQuantity = (state: RootState) =>
  state.cartList.cartList.reduce((acc, i) => acc + i.totalQuantity, 0);
