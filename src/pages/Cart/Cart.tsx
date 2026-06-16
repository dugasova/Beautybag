import './Cart.css';
import { useSelector, useDispatch } from 'react-redux';
import type { ICartItem, IProduct } from '../../types';
import Button from '../../components/ui/Button/Button';
import { removeFromCartList, plusQuantity, minusQuantity, clearCart } from '../../store/features/cartList/slice';
import { dbService } from '../../services/dbService';
import { selectCartList, selectTotalPrice, selectTotalQuantity } from '../../store/features/cartList/selectors';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserAuth } from '../../context/AuthContext';
import useAsync from '../../hooks/useAsync';
import useFirestore from '../../hooks/useFirestore';
import { toast } from 'react-toastify';

export default function Cart() {
  const { user } = UserAuth();
  const { updateCartList, moveFromCartToWishList, updateCartQuantity } = useFirestore();
  const { execute } = useAsync();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cartList = useSelector(selectCartList);
  const totalPrice = useSelector(selectTotalPrice);
  const totalQuantity = useSelector(selectTotalQuantity);
  const dispatch = useDispatch();

  const handlePlus = async (product: ICartItem) => {
    dispatch(plusQuantity(product));
    if (user) {
      await execute(() => updateCartQuantity(product.id, (Number(product.totalQuantity) || 1) + 1));
    }
  }
  const handleMinus = async (product: ICartItem) => {
    if (product.totalQuantity > 1) {
      dispatch(minusQuantity(product));
      if (user) {
        await execute(() => updateCartQuantity(product.id, (Number(product.totalQuantity) || 1) - 1));
      }
    }
  }
  const handleRemoveFromCart = async (product: IProduct) => {
    dispatch(removeFromCartList(product));
    if (user) {
      await execute(() => updateCartList(product, true));
    }
  }

  const handleMoveToWishlist = async (product: IProduct) => {
    dispatch(removeFromCartList(product));
    if (user) {
      await execute(() => moveFromCartToWishList(product));
    }
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error(t('cart.loginToOrder') || "Please login to place an order");
      navigate('/login');
      return;
    }

    if (cartList.length === 0) return;
    
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    await execute(async () => {
      dispatch(clearCart());
      if (user?.email) {
        await dbService.updateUserData(user.email, { savedProducts: [] });
      }
    });
  }

  return (
    <div className='cart-page'>
      <div className='cart-container'>
        <div className='cart-header'>
          <h1 className='cart-title'>{t('cart.title')}</h1>
          {cartList.length > 0 && (
            <div className='cart-summary-header'>
              <span>{Number(totalQuantity) || 0} {t('cart.items')}</span>
              <span className='total-amount'>{Number(totalPrice) || 0} UAH</span>
            </div>
          )}
        </div>

        {cartList.length > 0 ? (
          <>
            <ul className='cart-grid'>
              {cartList.map((item: ICartItem) => (
                <li key={item.id} className='cart-item'>
                  <div className='cart-image-wrapper'>
                    <img src={item.imsrcOfImg} alt={t(item.name)} className='cart-image' />
                  </div>
                  <div className='cart-details'>
                    <div className='cart-quantity-controls'>
                      <Button onClick={() => handleMinus(item)} className='cart-quantity-btn'>-</Button>
                      <span className='cart-quantity-display'>{Number(item.totalQuantity) || 1}</span>
                      <Button onClick={() => handlePlus(item)} className='cart-quantity-btn'>+</Button>
                    </div>
                    <h3 className='cart-name'>{t(item.name)}</h3>
                    <p className='cart-description'>{t(item.description)}</p>
                    <div className='cart-price-info'>
                      <span className='unit-price'>{item.discountPrice ?? item.price} UAH / {t('cart.unit')}</span>
                      <span className='total-item-price'>{t('cart.subtotal')}: {(item.discountPrice ?? item.price) * item.totalQuantity} UAH</span>
                    </div>
                    <p className='cart-raiting'>{item.raiting}</p>
                    <div className='cart-item-actions'>
                      <Button onClick={() => handleMoveToWishlist(item)} variant="purple" size="md" className="product-button-custom move-to-wishlist">
                        {t('cart.moveToWishlist')}
                      </Button>
                      <Button onClick={() => handleRemoveFromCart(item)} variant="purple" size="md" className="product-button-custom remove-from-cart">
                        {t('cart.removeFromCart')}
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className='cart-actions'>
              <Button onClick={() => handleClearCart()} variant="purple" size="md" className="clear-cart-btn">
                {t('cart.clear')}
              </Button>
              <Button onClick={handleCheckout} variant="purple" size="md" className="checkout-btn">
                {t('cart.checkout')}
              </Button>
            </div>
          </>
        ) : (
          <div className='cart-empty'>
            <h1>{t('cart.empty')}</h1>
            <div className='empty-cart-icon'>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35L10.55 19.9C5.58 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.42 15.36 13.45 19.9L12 21.35Z" fill="#a855f7" />
              </svg>
            </div>
            <p className='empty-msg'>{t('cart.emptyMessage')}</p>
            <Button variant="purple" size="md" onClick={() => navigate('/')}>{t('cart.backToProducts')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
