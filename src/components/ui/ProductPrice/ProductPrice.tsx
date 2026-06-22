import { memo } from 'react';
import './ProductPrice.css';

interface ProductPriceProps {
  price: number;
  discountPrice?: number;
  className?: string;
}

export default memo(function ProductPrice({ price, discountPrice, className = '' }: ProductPriceProps) {
  return (
    <div className={`product-price-wrapper ${className}`}>
      {discountPrice ? (
        <>
          <span className='product-price old'>{price} UAH</span>
          <span className='product-price current'>{discountPrice} UAH</span>
        </>
      ) : (
        <span className='product-price'>{price} UAH</span>
      )}
    </div>
  );
});
