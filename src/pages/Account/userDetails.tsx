import UseOrders from "../../hooks/UseOrders";
import './userDetails.css'
import { useTranslation } from "react-i18next";


export default function UserDetails() {
  const { t } = useTranslation();
  const orders = UseOrders();

  return (
    <div className="user-info">
      {orders[0]?.shippingAddress?.firstName && (
        <>
          <p><strong>{t('details.name')}:</strong> {orders[0].shippingAddress.firstName}</p>
          <p><strong>{t('details.lastName')}:</strong> {orders[0].shippingAddress.lastName}</p>
          <p><strong>{t('details.phone')}:</strong> {orders[0].shippingAddress.phone}</p>
          <p><strong>{t('details.city')}:</strong> {orders[0].shippingAddress.city}</p>
          <p><strong>{t('details.address')}:</strong> {orders[0].shippingAddress.address}</p>
        </>
      )}
    </div>

  )
}
