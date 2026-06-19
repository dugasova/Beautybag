import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState } from 'react';
import './ProductItem.css';
import type { IProduct } from '../../types';
import Button from '../ui/Button/Button';
import StarRating from '../ui/StarRating/StarRating';
import FavoriteButton from '../ui/FavoriteButton/FavoriteButton';
import ProductPrice from '../ui/ProductPrice/ProductPrice';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList, removeFromWishList } from '../../store/features/wishList/slice';
import { addToCartList, removeFromCartList } from '../../store/features/cartList/slice';
import { selectWishList } from '../../store/features/wishList/selectors';
import { selectCartList } from '../../store/features/cartList/selectors';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const wishList = useSelector(selectWishList);
  const cartList = useSelector(selectCartList);
  const isFavorite = wishList.some((item: IProduct) => item.id === product.id);
  const isInCart = cartList.some((item: IProduct) => item.id === product.id);

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
      <FavoriteButton isFavorite={isFavorite} onClick={handleFavoriteClick} className="product-favorite" />
      {product.discount && <div className="product-badge">-{product.discount}%</div>}
      <div className="product-link" onClick={() => navigate(`/product/${product.id}`)} role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/product/${product.id}`); }}>
        <img className='product-image' src={product.imsrcOfImg} alt={t(product.name)} />
        <h3 className='product-name'>{t(product.name)}</h3>
        <p className='product-description'>{t(product.description)}</p>
        <ProductPrice price={product.price} discountPrice={product.discountPrice} />
        <p className='product-raiting'><StarRating rating={product.raiting} /></p>
        <p className='product-category'>{product.category}</p>
      </div>
      <div className={`product-volume-container ${isHovered ? 'visible' : ''}`}>
        {product.volume && <p className='product-volume'>{product.volume} ml</p>}
        <Button onClick={handleAddToCart} variant="purple" size="md" className="product-button-custom">
          {isInCart ? t('cart.removeFromCart') : t('cart.addToCart')}
        </Button>
      </div>
    </motion.li>
  )
}
