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
    dispatch(setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc' | 'rating-desc'));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    dispatch(setPriceRange({ type, value }));
  };

  const handleRatingChange = (rating: number) => {
    dispatch(setMinRating(rating));
  };

  const handleRatingKeyDown = (e: React.KeyboardEvent, rating: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRatingChange(rating);
    }
  };

  return (
    <div className="product-filters">
      <div className="filter-group">
        <label htmlFor="sort-by">{t('filters.sortBy')}</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange} className="filter-select">
          <option value="default">{t('filters.default')}</option>
          <option value="price-asc">{t('filters.priceAsc')}</option>
          <option value="price-desc">{t('filters.priceDesc')}</option>
          <option value="rating-desc">{t('filters.ratingDesc')}</option>
        </select>
      </div>

      <div className="filter-group">
        <label id="price-range-label">{t('filters.priceRange')}</label>
        <div className="price-inputs" role="group" aria-labelledby="price-range-label">
          <input
            type="number"
            min="0"
            placeholder="Min"
            aria-label={t('filters.minPrice')}
            value={minPrice ?? ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            aria-label={t('filters.maxPrice')}
            value={maxPrice ?? ''}
            onChange={(e) => handlePriceChange('max', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label id="min-rating-label">{t('filters.minRating')}</label>
        <div className="rating-filter" role="group" aria-labelledby="min-rating-label">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              role="button"
              tabIndex={0}
              aria-pressed={star <= minRating}
              aria-label={t('filters.ratingAndUp', { count: star })}
              className={`star ${star <= minRating ? 'active' : ''}`}
              onClick={() => handleRatingChange(star)}
              onKeyDown={(e) => handleRatingKeyDown(e, star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <Button variant="secondary" size="sm" onClick={() => dispatch(resetFilters())}>
        {t('filters.reset')}
      </Button>
    </div>
  );
}
