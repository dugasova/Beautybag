import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { setSortBy, setPriceRange, setMinRating, resetFilters } from '../../store/features/search/slice';
import Button from '../ui/Button/Button';
import './ProductFilters.css';

export default function ProductFilters() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { sortBy, minPrice, maxPrice, minRating } = useSelector((state: RootState) => state.search);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    dispatch(setPriceRange({ type, value }));
  };

  const handleRatingChange = (rating: number) => {
    dispatch(setMinRating(rating));
  };

  return (
    <div className="product-filters">
      <div className="filter-group">
        <label>{t('filters.sortBy') || 'Sort By'}</label>
        <select value={sortBy} onChange={handleSortChange} className="filter-select">
          <option value="default">{t('filters.default') || 'Default'}</option>
          <option value="price-asc">{t('filters.priceAsc') || 'Price: Low to High'}</option>
          <option value="price-desc">{t('filters.priceDesc') || 'Price: High to Low'}</option>
          <option value="rating-desc">{t('filters.ratingDesc') || 'Top Rated'}</option>
        </select>
      </div>

      <div className="filter-group">
        <label>{t('filters.priceRange') || 'Price Range'}</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ?? ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ''}
            onChange={(e) => handlePriceChange('max', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label>{t('filters.minRating') || 'Min Rating'}</label>
        <div className="rating-filter">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= minRating ? 'active' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <Button variant="secondary" size="sm" onClick={() => dispatch(resetFilters())}>
        {t('filters.reset') || 'Reset Filters'}
      </Button>
    </div>
  );
}
