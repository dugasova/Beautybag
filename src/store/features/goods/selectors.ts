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
        const effectivePrice = product.discountPrice ?? product.price;
        const matchesCategory = !categoryFilter ||
          product.category === categoryFilter ||
          product.subCategory === categoryFilter;
        const matchesMinPrice = minPrice === null || effectivePrice >= minPrice;
        const matchesMaxPrice = maxPrice === null || effectivePrice <= maxPrice;
        const matchesRating = product.raiting >= minRating;

        return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
        if (sortBy === 'price-desc') return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
        if (sortBy === 'rating-desc') return b.raiting - a.raiting;
        return 0;
      });
  }
);
