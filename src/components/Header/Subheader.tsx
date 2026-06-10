import { motion, AnimatePresence } from 'framer-motion';
import './Subheader.css';
import searchIcon from '../../assets/icons/search.svg';
import cartIcon from '../../assets/icons/cart.svg';
import favoriteIcon from '../../assets/icons/favorite.svg';
import authorizedIcon from '../../assets/icons/profile.svg';
import SearchModal from '../SearchModal/SearchModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearchModalOpen } from '../../store/features/search/slice';
import type { RootState } from '../../store/store';
import { UserAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Subheader() {
  const { t } = useTranslation();
  const { user } = UserAuth();
  const wishList = useSelector((state: RootState) => state.wishList.wishList);
  const cartList = useSelector((state: RootState) => state.cartList.cartList);
  const isSearchOpen = useSelector((state: RootState) => state.search.isSearchModalOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenSearch = () => {
    dispatch(setIsSearchModalOpen(!isSearchOpen));
  }

  const handleNavigate = (path: string) => {
    navigate(path);
  }

  const handleNavigateKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate(path);
    }
  }

  return (
    <div className='subheader'>
      <button className='subheader-search-btn' onClick={handleOpenSearch}>
        <img src={searchIcon} alt="search" className='search-icon' />
      </button>
      <AnimatePresence>
        {isSearchOpen && <SearchModal />}
      </AnimatePresence>
      <div className='subheader-center'>
        <p className='subheader-message'>Beauty with love</p>
      </div>
      <div className='subheader-right'>
        <div
          className='subheader-icons'
          role="button"
          tabIndex={0}
          aria-label={user?.email ? t('header.account') : t('header.login')}
          onClick={() => handleNavigate(user?.email ? '/account' : '/login')}
          onKeyDown={(e) => handleNavigateKeyDown(e, user?.email ? '/account' : '/login')}
        >
          <img src={authorizedIcon} alt="" className='authorized-icon' />
        </div>

        <div
          className='subheader-icons wishlist-icons'
          role="button"
          tabIndex={0}
          aria-label={t('wishlist.title')}
          onClick={() => handleNavigate('/wishlist')}
          onKeyDown={(e) => handleNavigateKeyDown(e, '/wishlist')}
        >
          <AnimatePresence mode='popLayout'>
            {wishList.length > 0 && (
              <motion.span 
                key={wishList.length}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className='wishlist-count'
              >
                {wishList.length}
              </motion.span>
            )}
          </AnimatePresence>
          <img src={favoriteIcon} alt="" className='favorite-icon' />
        </div>

        <div
          className='subheader-icons cart-icons'
          role="button"
          tabIndex={0}
          aria-label={t('cart.title')}
          onClick={() => handleNavigate('/cart')}
          onKeyDown={(e) => handleNavigateKeyDown(e, '/cart')}
        >
          <AnimatePresence mode='popLayout'>
            {cartList.length > 0 && (
              <motion.span 
                key={cartList.length}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className='cart-count'
              >
                {cartList.length}
              </motion.span>
            )}
          </AnimatePresence>
          <img src={cartIcon} alt="" className='cart-icon' />
        </div>
      </div>
    </div >
  );
}
