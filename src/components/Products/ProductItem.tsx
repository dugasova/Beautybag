import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState } from 'react';
import './ProductItem.css';
import type { IProduct } from '../../types';
import Button from '../ui/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList, removeFromWishList } from '../../store/features/wishList/slice';
import { addToCartList, removeFromCartList } from '../../store/features/cartList/slice';
import type { RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';
import { UserAuth } from '../../context/AuthContext';
import useFirestore from '../../hooks/useFirestore';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};


export default function ProductItem({ product }: { product: IProduct }) {
  const { user } = UserAuth();
  const { updateWishList, updateCartList } = useFirestore();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const wishList = useSelector((state: RootState) => state.wishList.wishList);
  const cartList = useSelector((state: RootState) => state.cartList.cartList);
  const isFavorite = wishList.some((item: IProduct) => item.id === product.id);
  const isInCart = cartList.some((item: IProduct) => item.id === product.id);

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map(i => {
      const isFullStar = i <= Math.floor(rating);
      const isHalfStar = !isFullStar && rating % 1 >= 0.5 && i === Math.ceil(rating);

      if (isHalfStar) {
        return <span key={i} className="star star-half">★</span>;
      }
      return (
        <span key={i} className="star" style={{ color: isFullStar ? '#f59e0b' : '#d1d5db' }}>
          ★
        </span>
      );
    });
  };



  const handleAddToCart = async () => {
    if (isInCart) {
      dispatch(removeFromCartList(product));
    } else {
      dispatch(addToCartList(product));
    }

    if (user) {
      await updateCartList(product, isInCart);
    }
  };

  const handleFavoriteClick = async () => {
    if (isFavorite) {
      dispatch(removeFromWishList(product));
    } else {
      dispatch(addToWishList(product));
    }

    if (user) {
      await updateWishList(product, isFavorite);
    }
  };

  return (
    <motion.li
      variants={itemVariants}
      layout
      whileHover={{ y: -5 }}
      className={`product-item ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={product.id}
    >
      {/*add to wishlist*/}
      <p className={`product-favorite ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0.7 1.9 22.6 20.2' className='favorite-icon-svg'>
          <path
            d='M11.976 21.6a.636.636 0 0 1-.455-.187l-7.682-7.71c-1.613-1.619-2.522-3.442-2.628-5.274-.097-1.67.476-3.217 1.614-4.358 1.138-1.14 2.68-1.716 4.344-1.615 1.666.1 3.31.857 4.808 2.207 1.513-1.37 3.178-2.142 4.847-2.25 1.669-.108 3.224.462 4.363 1.604 1.139 1.143 1.706 2.692 1.6 4.374-.116 1.842-1.04 3.68-2.67 5.314l-7.69 7.708a.637.637 0 0 1-.45.187Z' />
        </svg>
      </p>
      {product.discount && <div className="product-badge">-{product.discount}%</div>}
      <img className='product-image' src={product.imsrcOfImg} alt={t(product.name)} />
      <h3 className='product-name'>{t(product.name)}</h3>
      <p className='product-description'>{t(product.description)}</p>
      <div className='product-price-wrapper'>
        {product.discountPrice ? (
          <>
            <span className='product-price old'>{product.price} UAH</span>
            <span className='product-price current'>{product.discountPrice} UAH</span>
          </>
        ) : (
          <span className='product-price'>{product.price} UAH</span>
        )}
      </div>
      <p className='product-raiting'>{renderStars(product.raiting)}</p>
      <p className='product-category'>{product.category}</p>
      <div className={`product-volume-container ${isHovered ? 'visible' : ''}`}>
        {product.volume && <p className='product-volume'>{product.volume} ml</p>}
        <Button onClick={handleAddToCart} variant="purple" size="md" className="product-button-custom">
          {isInCart ? t('cart.removeFromCart') : t('cart.addToCart')}
        </Button>
      </div>
    </motion.li>
  )
}
