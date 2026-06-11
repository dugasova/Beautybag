import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
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
  const cartList = useSelector((state: RootState) => state.cartList.cartList);
  const totalPrice = useSelector((state: RootState) => state.cartList.totalPrice);
  const totalQuantity = useSelector((state: RootState) => state.cartList.totalQuantity);

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
        status: 'pending'
      };

      await sendOrder(orderData);
      // Assuming sendOrder returns something with an id or we can generate one
      const generatedOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();

      dispatch(setOrderId(generatedOrderId));
      dispatch(clearCart());
      navigate('/order-success');
    }, t('cart.orderSuccess'), t('cart.orderError'));

    dispatch(setIsProcessing(false));
  };

  return (
    <div className="checkout-step-content">
      <h2>Review Your Order</h2>

      <div className="review-summary">
        <div className="review-section">
          <h3>Shipping to:</h3>
          <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
          <p>{shippingAddress.address}, {shippingAddress.city}</p>
          <p>{shippingAddress.phone}</p>
        </div>

        <div className="review-section">
          <h3>Payment Method:</h3>
          <p>{paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
        </div>

        <div className="review-items">
          <h3>Items:</h3>
          {cartList.map(item => (
            <div key={item.id} className="review-item">
              <span>{t(item.name)} x {item.totalQuantity}</span>
              <span>{item.price * item.totalQuantity} UAH</span>
            </div>
          ))}
          <div className="total-row">
            <span>Total</span>
            <span>{totalPrice} UAH</span>
          </div>
        </div>
      </div>

      <div className="checkout-actions">
        <Button onClick={() => dispatch(prevStep())} variant="secondary" size="md" disabled={isProcessing}>
          Back
        </Button>
        <Button onClick={handlePlaceOrder} variant="purple" size="md" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
