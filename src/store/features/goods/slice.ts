import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import type { IProduct } from '../../../types';

export const fetchGoods = createAsyncThunk(
  'goods/fetchGoods',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'goods'));
    const goods: IProduct[] = [];
    querySnapshot.forEach((doc) => {
      goods.push(doc.data() as IProduct);
    });
    return goods;
  }
);

interface GoodsState {
  items: IProduct[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GoodsState = {
  items: [],
  status: 'idle',
  error: null,
};

const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoods.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGoods.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchGoods.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch goods';
      });
  },
});

export default goodsSlice.reducer;
