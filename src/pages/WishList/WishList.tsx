import './WishList.css';
import { useSelector } from 'react-redux';
import { selectWishList } from '../../store/features/wishList/selectors';
import type { IProduct } from '../../types';

import Button from '../../components/ui/Button/Button';
import StarRating from '../../components/ui/StarRating/StarRating';
import { useDispatch } from 'react-redux';
import { removeFromWishList, clearWishList } from '../../store/features/wishList/slice';
import { addToCartList } from '../../store/features/cartList/slice';
import { useTranslation } from 'react-i18next';
import { UserAuth } from '../../context/AuthContext';
import useFirestore from '../../hooks/useFirestore';
import WishListEmpty from './WishListEmpty';

export default function WishList() {
  const { t } = useTranslation();
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
                  <p className='wishlist-raiting'><StarRating rating={item.raiting} /></p>
                  <Button onClick={() => handleAddToCart(item)} variant="purple" size="md" className="product-button-custom">{t('wishlist.addToCart')}</Button>
                  <Button onClick={() => handleRemoveFromWishList(item)} variant="purple" size="md" className="product-button-custom">{t('wishlist.removeFromWishList')}</Button>
                </div>
              </li>
            ))}
          </ul>
          <div className='wishlist-actions'>
            <Button onClick={() => handleClearWishList()} variant="purple" size="md" className="clear-wishlist-btn">
              {t('wishlist.clear')}
            </Button>
          </div>
        </>
      ) : (
        <WishListEmpty />
      )}
    </div>
  )
}
