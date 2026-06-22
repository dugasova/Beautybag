import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { plusQuantity, addToCartList } from '../../store/features/cartList/slice';
import { addToWishList, removeFromWishList } from '../../store/features/wishList/slice';
import { selectWishList } from '../../store/features/wishList/selectors';
import { selectCartList } from '../../store/features/cartList/selectors';
import Button from '../../components/ui/Button/Button';
import StarRating from '../../components/ui/StarRating/StarRating';
import type { RootState } from '../../store/store';
import type { IProduct } from '../../types';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const wishList = useSelector(selectWishList);
  const cartList = useSelector(selectCartList);
  const goods: IProduct[] = useSelector((state: RootState) => state.goods.items);

  const product = goods.find(item => item.id === Number(id));

  if (!product) {
    return (
      <div className="product-page-error">
        <h1>{t('product.notFound')}</h1>
        <Button onClick={() => navigate('/')}>{t('product.backToHome')}</Button>
      </div>
    );
  }

  const isFavorite = wishList.some((item) => item.id === product.id);
  const isInCart = cartList.find((item) => item.id === product.id);

  const handleToggleWishlist = () => {
    if (isFavorite) {
      dispatch(removeFromWishList(product));
    } else {
      dispatch(addToWishList(product));
    }
  };

  const handleAddToCart = () => {
    if (isInCart) {
      dispatch(plusQuantity(product));
    } else {
      dispatch(addToCartList(product));
    }
  };

  const handleBreadcrumbKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="product-page-container">
      <div className="product-page-wrapper">
        <div className="product-media-section">
          <div className="product-image-main">
            <img src={product.imsrcOfImg} alt={t(product.name)} />
          </div>
        </div>

        <div className="product-info-section">
          <nav className="breadcrumb" aria-label={t('common.breadcrumb')}>
            <a role="link" tabIndex={0} onClick={() => navigate('/')} onKeyDown={(e) => handleBreadcrumbKeyDown(e, '/')}>{t('navigation.home')}</a>
            <span className="separator" aria-hidden="true">/</span>
            <span>{product.category}</span>
            <span className="separator" aria-hidden="true">/</span>
            <span className="current" aria-current="page">{t(product.name)}</span>
          </nav>

          <h1 className="product-title">{t(product.name)}</h1>

          <div className="product-meta">
            <div className="product-rating">
              <StarRating rating={product.raiting} />
              <span className="rating-value">{product.raiting}</span>
            </div>
            <span className="product-status">{t('product.inStock')}</span>
          </div>

          <div className="product-price-section">
            <span className="current-price">{product.price} UAH</span>
            {product.volume && <span className="product-volume">{product.volume} ml</span>}
          </div>

          <p className="product-description-long">
            {t(product.description)}
            <br /><br />
            {t('product.premiumDesc')}
          </p>

          <div className="product-actions-grid">
            <Button
              variant="purple"
              size="lg"
              className="add-to-cart-big"
              onClick={handleAddToCart}
            >
              {isInCart ? `${t('cart.addToCart')} (${isInCart.totalQuantity})` : t('cart.addToCart')}
            </Button>

            <button
              className={`wishlist-toggle-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleToggleWishlist}
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? "#a855f7" : "none"} stroke={isFavorite ? "#a855f7" : "#1e293b"}>
                <path d="M12 21.35L10.55 19.9C5.58 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.42 15.36 13.45 19.9L12 21.35Z" />
              </svg>
            </button>
          </div>

          <div className="product-features">
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <div className="feature-text">
                <strong>{t('product.freeDelivery')}</strong>
                <span>{t('product.freeDeliveryDesc')}</span>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div className="feature-text">
                <strong>{t('product.genuine')}</strong>
                <span>{t('product.genuineDesc')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
