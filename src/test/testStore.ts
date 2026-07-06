import { configureStore } from '@reduxjs/toolkit';
import wishListReducer from '../store/features/wishList/slice';
import cartListReducer from '../store/features/cartList/slice';
import searchReducer from '../store/features/search/slice';
import goodsReducer from '../store/features/goods/slice';
import checkoutReducer from '../store/features/checkout/slice';
import type { RootState } from '../store/store';

const reducer = {
  wishList: wishListReducer,
  cartList: cartListReducer,
  search: searchReducer,
  goods: goodsReducer,
  checkout: checkoutReducer,
};

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer, preloadedState: preloadedState as RootState });
}
