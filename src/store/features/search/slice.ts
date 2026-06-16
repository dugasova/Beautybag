import { createSlice } from "@reduxjs/toolkit";

type SortBy = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

interface SearchState {
  isSearchModalOpen: boolean;
  categoryFilter: string;
  sortBy: SortBy;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number;
}

const initialState: SearchState = {
  isSearchModalOpen: false,
  categoryFilter: "",
  sortBy: "default",
  minPrice: null,
  maxPrice: null,
  minRating: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setIsSearchModalOpen: (state, action) => {
      state.isSearchModalOpen = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setSortBy: (state, action: { payload: SortBy }) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (state, action: { payload: { type: 'min' | 'max', value: string } }) => {
      const { type, value } = action.payload;
      const numValue = value === '' ? null : Number(value);
      if (type === 'min') {
        state.minPrice = numValue;
      } else {
        state.maxPrice = numValue;
      }
    },
    setMinRating: (state, action: { payload: number }) => {
      const rating = action.payload;
      state.minRating = state.minRating === rating ? 0 : rating;
    },
    resetFilters: (state) => {
      state.sortBy = "default";
      state.minPrice = null;
      state.maxPrice = null;
      state.minRating = 0;
    }
  },
});

export const {
  setIsSearchModalOpen,
  setCategoryFilter,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters
} = searchSlice.actions;

export default searchSlice.reducer;
