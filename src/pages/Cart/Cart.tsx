import './Cart.css';
import { useSelector, useDispatch } from 'react-redux';
import type { ICartItem, IProduct } from '../../types';
import { removeFromCartList, plusQuantity, minusQuantity, clearCart } from '../../store/features/cartList/slice';
import { dbService } from '../../services/dbService';
import { selectCartList, selectTotalPrice, selectTotalQuantity, selectTotalDiscount } from '../../store/features/cartList/selectors';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserAuth } from '../../context/AuthContext';
import useAsync from '../../hooks/useAsync';
import useFirestore from '../../hooks/useFirestore';
import { toast } from 'react-toastify';
import CartItem from './CartItem';
import CartEmpty from './CartEmpty';
import CartSummary from './CartSummary';

export default function Cart() {
  const { user } = UserAuth();
  const { updateCartList, moveFromCartToWishList, updateCartQuantity } = useFirestore();
  const { execute } = useAsync();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cartList = useSelector(selectCartList);
  const totalPrice = useSelector(selectTotalPrice);
  const totalQuantity = useSelector(selectTotalQuantity);
  const totalDiscount = useSelector(selectTotalDiscount);
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
              <span>{totalQuantity} {t('cart.items')}</span>
              <span className='total-amount'>{totalPrice} UAH</span>
              {totalDiscount > 0 && (
                <span className='cart-total-discount'>{t('cart.totalDiscount')}: -{totalDiscount} UAH</span>
              )}
            </div>
          )}
        </div>

        {cartList.length > 0 ? (
          <>
            <ul className='cart-grid'>
              {cartList.map((item: ICartItem) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onPlus={handlePlus}
                  onMinus={handleMinus}
                  onRemove={handleRemoveFromCart}
                  onMoveToWishlist={handleMoveToWishlist}
                />
              ))}
            </ul>
            <CartSummary handleClearCart={handleClearCart} handleCheckout={handleCheckout} />
          </>
        ) : (
          <CartEmpty />
        )}
      </div>
    </div>
  )
}
