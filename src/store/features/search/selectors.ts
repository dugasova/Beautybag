import type { RootState } from "../../store";

export const selectCategoryFilter = (state: RootState) => state.search.categoryFilter;
export const selectSortBy         = (state: RootState) => state.search.sortBy;
export const selectMinPrice       = (state: RootState) => state.search.minPrice;
export const selectMaxPrice       = (state: RootState) => state.search.maxPrice;
export const selectMinRating      = (state: RootState) => state.search.minRating;
