import { createSlice } from "@reduxjs/toolkit";
import type { IProduct } from "../../../types";

interface SearchState {
  search: string;
  searchList: IProduct[];
  isSearchModalOpen: boolean;
  categoryFilter: string;
  sortBy: string;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number;
}

const initialState: SearchState = {
  search: "",
  searchList: [],
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
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSearchList: (state, action) => {
      state.searchList = action.payload;
    },
    setIsSearchModalOpen: (state, action) => {
      state.isSearchModalOpen = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setSortBy: (state, action) => {
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
    clearSearch: (state) => {
      state.search = "";
      state.searchList = [];
    },
    clearCategoryFilter: (state) => {
      state.categoryFilter = "";
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
  setSearch, 
  setSearchList, 
  clearSearch, 
  setIsSearchModalOpen, 
  setCategoryFilter, 
  clearCategoryFilter,
  setSortBy,
  setPriceRange,
  setMinRating,
  resetFilters
} = searchSlice.actions;

export default searchSlice.reducer;
