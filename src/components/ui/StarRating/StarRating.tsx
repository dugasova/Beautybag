import { memo } from 'react';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
  className?: string;
}

export default memo(function StarRating({ rating, className = '' }: StarRatingProps) {
  return (
    <span className={`star-rating ${className}`}>
      {[1, 2, 3, 4, 5].map(i => {
        const isFullStar = i <= Math.floor(rating);
        const isHalfStar = !isFullStar && rating % 1 >= 0.5 && i === Math.ceil(rating);

        return (
          <span key={i} className={`star ${isFullStar ? 'filled' : ''} ${isHalfStar ? 'star-half' : ''}`}>
            ★
          </span>
        );
      })}
    </span>
  );
});
