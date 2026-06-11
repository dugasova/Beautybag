import type { IProduct } from '../../types';
import { useTranslation } from 'react-i18next';

interface SearchResultItemProps {
  product: IProduct;
  onSelect: (productId: number) => void;
}

export default function SearchResultItem({ product, onSelect }: SearchResultItemProps) {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(product.id);
    }
  };

  return (
    <li
      className='search-result-item'
      role="button"
      tabIndex={0}
      aria-label={t(product.name)}
      onClick={() => onSelect(product.id)}
      onKeyDown={handleKeyDown}
    >
      <img src={product.imsrcOfImg} alt={t(product.name)} className='result-thumb' />
      <div className='result-info'>
        <span className='result-name'>{t(product.name)}</span>
        <span className='result-category'>{product.category}</span>
      </div>
      <span className='result-price'>{product.price} UAH</span>
    </li>
  );
}
