import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import { resetCheckout } from '../../store/features/checkout/slice';
import Button from '../../components/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const orderId = useSelector((state: RootState) => state.checkout.orderId);

  const handleContinueShopping = () => {
    dispatch(resetCheckout()); // Reset ONLY when user actively navigates away
    navigate('/');
  };

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <div className="success-icon">✓</div>
        <h1>{orderId ? t('checkout.orderSuccess.title') : t('checkout.orderSuccess.titleFallback')}</h1>
        {orderId && (
          <p className="order-id">{t('checkout.orderSuccess.orderId')} <strong>#{orderId}</strong></p>
        )}
        <p className="success-msg">
          {orderId ? t('checkout.orderSuccess.message') : t('checkout.orderSuccess.messageFallback')}
        </p>
        <div className="success-actions">
          <Button variant="purple" size="lg" onClick={orderId ? handleContinueShopping : () => navigate('/')}>
            {orderId ? t('checkout.orderSuccess.continueShopping') : t('checkout.orderSuccess.goHome')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
