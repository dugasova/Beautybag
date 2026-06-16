import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import './Checkout.css';
import { useTranslation } from 'react-i18next';

const Checkout = () => {
  const { t } = useTranslation();
  const currentStep = useSelector((state: RootState) => state.checkout.currentStep);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-steps-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>{t('checkout.steps.shipping')}</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>{t('checkout.steps.payment')}</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>{t('checkout.steps.review')}</div>
        </div>

        {currentStep === 1 && <ShippingStep />}
        {currentStep === 2 && <PaymentStep />}
        {currentStep === 3 && <ReviewStep />}
      </div>
    </div>
  );
};

export default Checkout;
