import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

const selectGoodsItems = (state: RootState) => state.goods.items;
const selectSearchState = (state: RootState) => state.search;

export const selectFilteredProducts = createSelector(
  [selectGoodsItems, selectSearchState],
  (goods, search) => {
    const { categoryFilter, sortBy, minPrice, maxPrice, minRating } = search;

    return [...goods]
      .filter((product) => {
        // Category filter
        const matchesCategory = !categoryFilter || 
          product.category === categoryFilter || 
          product.subCategory === categoryFilter;
        
        // Price filter
        const matchesMinPrice = minPrice === null || product.price >= minPrice;
        const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;
        
        // Rating filter
        const matchesRating = product.raiting >= minRating;

        return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.raiting - a.raiting;
        return 0; // Default
      });
  }
);
