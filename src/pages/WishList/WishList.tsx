import './WishList.css';
import { useSelector } from 'react-redux';
import { selectWishList } from '../../store/features/wishList/selectors';
import type { IProduct } from '../../types';

import Button from '../../components/ui/Button/Button';
import { useDispatch } from 'react-redux';
import { removeFromWishList, clearWishList } from '../../store/features/wishList/slice';
import { addToCartList } from '../../store/features/cartList/slice';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import useFirestore from '../../hooks/useFirestore';

export default function WishList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = UserAuth();
  const { updateWishList, clearWishList: clearWishListInFirestore } = useFirestore();
  const wishList = useSelector(selectWishList);
  const dispatch = useDispatch();
  const handleRemoveFromWishList = async (product: IProduct) => {
    dispatch(removeFromWishList(product));
    if (user) {
      await updateWishList(product, true);
    }
  }
  const handleAddToCart = (product: IProduct) => {
    dispatch(addToCartList(product));
  }
  const handleClearWishList = async () => {
    dispatch(clearWishList());
    if (user) {
      await clearWishListInFirestore();
    }
  }

  return (
    <div className='wishlist-container'>
      {wishList.length > 0 ? (
        <>
          <h1 className='wishlist-title'>{t('wishlist.title')}</h1>
          <ul className='wishlist-grid'>
            {wishList.map((item: IProduct) => (
              <li key={item.id} className='wishlist-item'>
                <div className='wishlist-image-wrapper'>
                  <img src={item.imsrcOfImg} alt={t(item.name)} className='wishlist-image' />
                </div>
                <div className='wishlist-details'>
                  <h3 className='wishlist-name'>{t(item.name)}</h3>
                  <p className='wishlist-description'>{t(item.description)}</p>
                  <p className='wishlist-price'>{item.price} UAH</p>
                  <p className='wishlist-raiting'>{item.raiting}</p>
                  <Button onClick={() => handleAddToCart(item)} variant="purple" size="md" className="product-button-custom">{t('wishlist.addToCart')}</Button>
                  <Button onClick={() => handleRemoveFromWishList(item)} variant="purple" size="md" className="product-button-custom">{t('wishlist.removeFromWishList')}</Button>
                </div>
              </li>
            ))}
          </ul>
          <div className='wishlist-actions'>
            <Button onClick={() => handleClearWishList()} variant="purple" size="md" className="clear-wishlist-btn">
              Clear WishList
            </Button>
          </div>
        </>
      ) : (
        <div className='wishlist-empty'>
          <h1>{t('wishlist.empty')}</h1>
          <p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35L10.55 19.9C5.58 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.42 15.36 13.45 19.9L12 21.35Z" fill="currentColor" />
            </svg>
          </p>
          <p>{t('wishlist.emptyMessage')}</p>
          <Button onClick={() => navigate('/')} variant="purple" size="md">
            {t('wishlist.backToProducts')}
          </Button>
        </div>
      )}
    </div>
  )
}
