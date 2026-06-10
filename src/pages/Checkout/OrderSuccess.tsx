import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { resetCheckout } from '../../store/features/checkout/slice';
import Button from '../../components/ui/Button/Button';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderId = useSelector((state: RootState) => state.checkout.orderId);

  const handleContinueShopping = () => {
    dispatch(resetCheckout()); // Reset ONLY when user actively navigates away
    navigate('/');
  };

  // Show fallback if orderId missing (e.g. user revisited the page)
  if (!orderId) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="success-icon">✓</div>
          <h1>Order Placed!</h1>
          <p className="success-msg">
            Your order was received. Check your account page for details.
          </p>
          <div className="success-actions">
            <Button variant="purple" size="lg" onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <div className="success-icon">✓</div>
        <h1>Thank You for Your Order!</h1>
        <p className="order-id">Order ID: <strong>#{orderId}</strong></p>
        <p className="success-msg">
          We've received your order and we're getting it ready for shipment.
          A confirmation email has been sent to your inbox.
        </p>
        <div className="success-actions">
          <Button variant="purple" size="lg" onClick={handleContinueShopping}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
