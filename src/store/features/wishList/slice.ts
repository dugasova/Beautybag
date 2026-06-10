import { createSlice } from "@reduxjs/toolkit";
import type { IProduct } from "../../../types";

interface WishListState {
  wishList: IProduct[];
}

const initialState: WishListState = {
  wishList: [],
};

const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    addToWishList: (state, action) => {
      state.wishList.push(action.payload);
    },
    removeFromWishList: (state, action) => {
      state.wishList = state.wishList.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    clearWishList: (state) => {
      state.wishList = [];
    },
    setWishList: (state, action) => {
      state.wishList = action.payload;
    },
  },
});

export const { addToWishList, removeFromWishList, clearWishList, setWishList } =
  wishListSlice.actions;
export default wishListSlice.reducer;
