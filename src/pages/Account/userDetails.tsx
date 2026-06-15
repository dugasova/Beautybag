import useOrders from "../../hooks/useOrders";
import './userDetails.css'
import { useTranslation } from "react-i18next";

export default function UserDetails() {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const { firstName, lastName, phone, city, address } = orders[0]?.shippingAddress || {};

  return (
    <div className="user-info">
      {firstName && (
        <>
          <p><strong>{t('details.name')}:</strong> {firstName}</p>
          <p><strong>{t('details.lastName')}:</strong> {lastName}</p>
          <p><strong>{t('details.phone')}:</strong> {phone}</p>
          <p><strong>{t('details.city')}:</strong> {city}</p>
          <p><strong>{t('details.address')}:</strong> {address}</p>
        </>
      )}
    </div>

  )
}
