import { configureStore } from "@reduxjs/toolkit";
import wishListReducer from "./features/wishList/slice";
import cartListReducer from "./features/cartList/slice";
import searchReducer from "./features/search/slice";
import goodsReducer from "./features/goods/slice";
import checkoutReducer from "./features/checkout/slice";

export const store = configureStore({
  reducer: {
    wishList: wishListReducer,
    cartList: cartListReducer,
    search: searchReducer,
    goods: goodsReducer,
    checkout: checkoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
