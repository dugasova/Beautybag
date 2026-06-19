import { useTranslation } from 'react-i18next';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  className?: string;
}

export default function FavoriteButton({ isFavorite, onClick, className = '' }: FavoriteButtonProps) {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <p
      className={`favorite-btn ${isFavorite ? 'active' : ''} ${className}`}
      role="button"
      tabIndex={0}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? t('wishlist.removeFromWishList') : t('wishlist.addToWishList')}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0.7 1.9 22.6 20.2' className='favorite-icon-svg' aria-hidden="true">
        <path d='M11.976 21.6a.636.636 0 0 1-.455-.187l-7.682-7.71c-1.613-1.619-2.522-3.442-2.628-5.274-.097-1.67.476-3.217 1.614-4.358 1.138-1.14 2.68-1.716 4.344-1.615 1.666.1 3.31.857 4.808 2.207 1.513-1.37 3.178-2.142 4.847-2.25 1.669-.108 3.224.462 4.363 1.604 1.139 1.143 1.706 2.692 1.6 4.374-.116 1.842-1.04 3.68-2.67 5.314l-7.69 7.708a.637.637 0 0 1-.45.187Z' />
      </svg>
    </p>
  );
}
