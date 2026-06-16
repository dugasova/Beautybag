import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { selectCartList, selectTotalPrice, selectTotalQuantity } from '../../store/features/cartList/selectors';
import { prevStep, setIsProcessing, setOrderId } from '../../store/features/checkout/slice';
import { clearCart } from '../../store/features/cartList/slice';
import Button from '../../components/ui/Button/Button';
import useFirestore from '../../hooks/useFirestore';
import useAsync from '../../hooks/useAsync';
import { useTranslation } from 'react-i18next';

const ReviewStep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendOrder } = useFirestore();
  const { execute } = useAsync();
  const { t } = useTranslation();

  const { shippingAddress, paymentMethod, isProcessing } = useSelector((state: RootState) => state.checkout);
  const cartList = useSelector(selectCartList);
  const totalPrice = useSelector(selectTotalPrice);
  const totalQuantity = useSelector(selectTotalQuantity);

  const handlePlaceOrder = async () => {
    dispatch(setIsProcessing(true));

    await execute(async () => {
      const orderData = {
        items: cartList,
        totalPrice,
        totalQuantity,
        shippingAddress,
        paymentMethod,
        createdAt: new Date().toISOString(),
        status: 'pending' as const
      };

      const orderId = await sendOrder(orderData);
      if (!orderId) return;

      dispatch(setOrderId(orderId));
      dispatch(clearCart());
      navigate('/order-success');
    }, t('cart.orderSuccess'), t('cart.orderError'));

    dispatch(setIsProcessing(false));
  };

  return (
    <div className="checkout-step-content">
      <h2>{t('checkout.review.title')}</h2>

      <div className="review-summary">
        <div className="review-section">
          <h3>{t('checkout.review.shippingTo')}</h3>
          <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
          <p>{shippingAddress.address}, {shippingAddress.city}</p>
          <p>{shippingAddress.phone}</p>
        </div>

        <div className="review-section">
          <h3>{t('checkout.review.paymentMethod')}</h3>
          <p>{paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
        </div>

        <div className="review-items">
          <h3>{t('checkout.review.items')}</h3>
          {cartList.map(item => (
            <div key={item.id} className="review-item">
              <span>{t(item.name)} x {item.totalQuantity}</span>
              <span>{(item.discountPrice ?? item.price) * item.totalQuantity} UAH</span>
            </div>
          ))}
          <div className="total-row">
            <span>{t('checkout.review.total')}</span>
            <span>{totalPrice} UAH</span>
          </div>
        </div>
      </div>

      <div className="checkout-actions">
        <Button onClick={() => dispatch(prevStep())} variant="secondary" size="md" disabled={isProcessing}>
          {t('checkout.back')}
        </Button>
        <Button onClick={handlePlaceOrder} variant="purple" size="md" disabled={isProcessing}>
          {isProcessing ? t('checkout.review.processing') : t('checkout.review.placeOrder')}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
