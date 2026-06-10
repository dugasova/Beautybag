import './Delivery.css';
import { useTranslation } from 'react-i18next';

export default function Delivery() {
  const { t } = useTranslation();

  const deliveryMethods = [
    {
      id: 1,
      title: 'Courier Delivery',
      description: 'Quick delivery right to your doorstep. Available in major cities.',
      time: '1-2 business days',
      price: '50 UAH'
    },
    {
      id: 2,
      title: 'Post Office',
      description: 'Pickup from your nearest post station at your convenience.',
      time: '2-4 business days',
      price: '30 UAH'
    },
    {
      id: 3,
      title: 'Boutique Pickup',
      description: 'Order online and pick up from any of our boutique locations.',
      time: 'Same day',
      price: 'Free'
    }
  ];

  const paymentMethods = [
    { id: 1, title: 'Credit Card', description: 'Visa, MasterCard, or Apple Pay' },
    { id: 2, title: 'Cash on Delivery', description: 'Pay when you receive your package' },
    { id: 3, title: 'Online Banking', description: 'Direct bank transfer' }
  ];

  return (
    <section className="delivery-page">
      <div className="container">

        <div className="delivery-header">
          <h1 className="delivery-title">{t('navigation.delivery', 'Delivery and Payments')}</h1>
          <p className="delivery-subtitle">We ensure your beauty treats arrive safely and on time.</p>
        </div>

        <div className="delivery-section">
          <h2 className="section-title">Delivery Options</h2>
          <div className="delivery-grid">
            {deliveryMethods.map((method) => (
              <div key={method.id} className="delivery-card">
                <div className="card-icon">🚀</div>
                <h3 className="card-title">{method.title}</h3>
                <p className="card-description">{method.description}</p>
                <div className="card-footer">
                  <span className="card-time">{method.time}</span>
                  <span className="card-price">{method.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="delivery-section">
          <h2 className="section-title">Payment Methods</h2>
          <div className="payment-grid">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-card">
                <div className="card-icon">💳</div>
                <h3 className="card-title">{method.title}</h3>
                <p className="card-description">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}
