import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export const selectWishList = (state: RootState) => state.wishList.wishList;

export const selectWishListCount = createSelector(
  selectWishList,
  (wishList) => wishList.length,
);
