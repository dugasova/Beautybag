import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserAuth } from '../../context/AuthContext';
import useOrders from '../../hooks/useOrders';
import useUserProfile from '../../hooks/useUserProfile';
import OrdersTab from './components/OrdersTab';
import ProfileTab from './components/ProfileTab';
import AddressesTab from './components/AddressesTab';
import './Account.css';

export default function Account() {
  const { user } = UserAuth();
  const { t } = useTranslation();
  const { orders, loading: ordersLoading } = useOrders();
  const { profile, updateProfile, addAddress, deleteAddress } = useUserProfile();

  const [tab, setTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  const { firstName: shippingFirstName } = orders[0]?.shippingAddress || {};
  const avatarSrc = profile.avatarUrl;
  const displayUserName = shippingFirstName || profile.displayName || user?.email?.split('@')[0] || 'User';
  const userInitial = (shippingFirstName?.[0] || profile.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase();

  return (
    <div className="account-page">
      <div className="account-container">

        {/* ── Header ── */}
        <div className="account-header">
          <div className="account-avatar-wrap">
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" className="account-avatar" />
              : <div className="account-avatar-placeholder">{userInitial}</div>
            }
          </div>
          <div>
            <h1 className="account-title">{displayUserName}</h1>
            <p className="account-email">{user?.email}</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="account-tabs">
          <button className={`acc-tab ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}>
            {t('account.orders')}
          </button>
          <button className={`acc-tab ${tab === 'profile' ? 'active' : ''}`}
            onClick={() => setTab('profile')}>
            Profile
          </button>
          <button className={`acc-tab ${tab === 'addresses' ? 'active' : ''}`}
            onClick={() => setTab('addresses')}>
            Addresses
          </button>
        </div>

        {tab === 'orders' && (
          <OrdersTab orders={orders} loading={ordersLoading} />
        )}

        {tab === 'profile' && (
          <ProfileTab
            user={user}
            profile={profile}
            updateProfile={updateProfile}
          />
        )}

        {tab === 'addresses' && (
          <AddressesTab
            addresses={profile.addresses || []}
            onDelete={deleteAddress}
            onAdd={addAddress}
          />
        )}

      </div>
    </div>
  );
}
