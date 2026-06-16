import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setPaymentMethod, nextStep, prevStep } from '../../store/features/checkout/slice';
import Button from '../../components/ui/Button/Button';
import { useTranslation } from 'react-i18next';

const PaymentStep = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const paymentMethod = useSelector((state: RootState) => state.checkout.paymentMethod);

  return (
    <div className="checkout-step-content">
      <h2>{t('checkout.payment.title')}</h2>
      <div className="payment-options">
        <div
          className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
          onClick={() => dispatch(setPaymentMethod('card'))}
        >
          <input type="radio" checked={paymentMethod === 'card'} readOnly />
          <span>{t('checkout.payment.card')}</span>
        </div>
        <div
          className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}
          onClick={() => dispatch(setPaymentMethod('paypal'))}
        >
          <input type="radio" checked={paymentMethod === 'paypal'} readOnly />
          <span>{t('checkout.payment.paypal')}</span>
        </div>
        <div
          className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
          onClick={() => dispatch(setPaymentMethod('cash'))}
        >
          <input type="radio" checked={paymentMethod === 'cash'} readOnly />
          <span>{t('checkout.payment.cash')}</span>
        </div>
      </div>

      <div className="checkout-actions">
        <Button onClick={() => dispatch(prevStep())} variant="secondary" size="md">{t('checkout.back')}</Button>
        <Button onClick={() => dispatch(nextStep())} variant="purple" size="md">{t('checkout.payment.reviewOrder')}</Button>
      </div>
    </div>
  );
};

export default PaymentStep;
