import './Delivery.css';
import { useTranslation } from 'react-i18next';
import {
  MdLocalShipping, MdLocalPostOffice, MdStorefront,
  MdCreditCard, MdPayments, MdAccountBalance,
} from 'react-icons/md';
import type { IconType } from 'react-icons';

const DELIVERY_METHODS: { key: string; Icon: IconType }[] = [
  { key: 'courier',    Icon: MdLocalShipping },
  { key: 'postOffice', Icon: MdLocalPostOffice },
  { key: 'boutique',   Icon: MdStorefront },
];

const PAYMENT_METHODS: { key: string; Icon: IconType }[] = [
  { key: 'card',    Icon: MdCreditCard },
  { key: 'cash',    Icon: MdPayments },
  { key: 'banking', Icon: MdAccountBalance },
];

export default function Delivery() {
  const { t } = useTranslation();

  return (
    <section className="delivery-page">
      <div className="container">
        <div className="delivery-header">
          <h1 className="delivery-title">{t('delivery.title')}</h1>
          <p className="delivery-subtitle">{t('delivery.subtitle')}</p>
        </div>

        <div className="delivery-section">
          <h2 className="section-title">{t('delivery.deliveryOptions')}</h2>
          <div className="delivery-grid">
            {DELIVERY_METHODS.map(({ key, Icon }) => (
              <div key={key} className="delivery-card">
                <Icon className="card-icon" size={32} />
                <h3 className="card-title">{t(`delivery.methods.${key}.title`)}</h3>
                <p className="card-description">{t(`delivery.methods.${key}.description`)}</p>
                <div className="card-footer">
                  <span className="card-time">{t(`delivery.methods.${key}.time`)}</span>
                  <span className="card-price">{t(`delivery.methods.${key}.price`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="delivery-section">
          <h2 className="section-title">{t('delivery.paymentMethods')}</h2>
          <div className="payment-grid">
            {PAYMENT_METHODS.map(({ key, Icon }) => (
              <div key={key} className="payment-card">
                <Icon className="card-icon" size={32} />
                <h3 className="card-title">{t(`delivery.payments.${key}.title`)}</h3>
                <p className="card-description">{t(`delivery.payments.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
