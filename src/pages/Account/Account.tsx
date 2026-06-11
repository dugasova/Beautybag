import { useState, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import { UserAuth } from '../../context/AuthContext';
import { storage } from '../../firebase';
import useOrders from '../../hooks/useOrders';
import useUserProfile from '../../hooks/useUserProfile';
import PageLoader from '../../components/ui/PageLoader/PageLoader';
import type { IAddress } from '../../types';
import './Account.css';

// ─── Status Badge ───────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Processing', cls: 'status-pending' },
  processing: { label: 'Processing', cls: 'status-pending' },
  shipped: { label: 'Shipped', cls: 'status-shipped' },
  delivered: { label: 'Delivered', cls: 'status-delivered' },
};

// ─── Empty address form ──────────────────────────────────────────────────────
const emptyAddr: Omit<IAddress, 'id'> = {
  label: '', firstName: '', lastName: '', address: '', city: '', phone: '',
};

export default function Account() {
  const { user } = UserAuth();
  const { t } = useTranslation();
  const { orders, loading: ordersLoading } = useOrders();
  const { profile, updateProfile, addAddress, deleteAddress } = useUserProfile();

  const [tab, setTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // ── Profile state ──
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Address form state ──
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState(emptyAddr);

  // When tab switches to profile, pre-fill with existing data
  const handleTabProfile = () => {
    setTab('profile');
    setDisplayName(profile.displayName || '');
    setPhone(profile.phone || '');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    if (!user?.email) return;
    setSaving(true);
    let avatarUrl = profile.avatarUrl;
    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${user.email}`);
      await uploadBytes(storageRef, avatarFile);
      avatarUrl = await getDownloadURL(storageRef);
    }
    await updateProfile({ displayName, phone, avatarUrl });
    setSaving(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAddress(addrForm);
    setAddrForm(emptyAddr);
    setShowAddrForm(false);
  };

  const getDisplayUserName = () => {
    return orders[0]?.shippingAddress?.firstName || profile.displayName || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitial = () => {
    return orders[0]?.shippingAddress?.firstName?.[0]?.toUpperCase() 
      || profile.displayName?.[0]?.toUpperCase() 
      || user?.email?.[0]?.toUpperCase() 
      || 'U';
  };

  return (
    <div className="account-page">
      <div className="account-container">

        {/* ── Header ── */}
        <div className="account-header">
          <div className="account-avatar-wrap">
            {profile.avatarUrl || avatarPreview
              ? <img src={avatarPreview || profile.avatarUrl} alt="avatar" className="account-avatar" />
              : <div className="account-avatar-placeholder">
                  {getUserInitial()}
                </div>
            }
          </div>
          <div>
            <h1 className="account-title">
              {getDisplayUserName()}
            </h1>
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
            onClick={handleTabProfile}>
            Profile
          </button>
          <button className={`acc-tab ${tab === 'addresses' ? 'active' : ''}`}
            onClick={() => setTab('addresses')}>
            Addresses
          </button>
        </div>

        {/* ══════════════ ORDERS TAB ══════════════ */}
        {tab === 'orders' && (
          <div className="orders-section">
            {ordersLoading ? (
              <PageLoader />
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => {
                  const cfg = statusConfig[order.status || 'pending'];
                  return (
                    <div key={order.id!} className="order-card">
                      <div className="order-header">
                        <span className="order-id">#{order.id?.slice(0, 8)}</span>
                        <span className={`order-status ${cfg.cls}`}>{cfg.label}</span>
                        <span className="order-date">
                          {order.createdAt instanceof Timestamp
                            ? order.createdAt.toDate().toLocaleDateString()
                            : new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <span>{t(item.name)} × {item.totalQuantity || 1}</span>
                            <span>{(Number(item.price) || 0) * (Number(item.totalQuantity) || 1)} UAH</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <strong>{t('cart.totalPrice') || 'Total'}: {Number(order.totalPrice) || 0} UAH</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-orders">{t('account.noOrders')}</p>
            )}
          </div>
        )}

        {/* ══════════════ PROFILE TAB ══════════════ */}
        {tab === 'profile' && (
          <div className="profile-section">
            <div className="avatar-upload-area" onClick={() => fileRef.current?.click()}>
              {avatarPreview || profile.avatarUrl
                ? <img src={avatarPreview || profile.avatarUrl} alt="avatar" className="avatar-preview" />
                : <div className="avatar-placeholder-lg">{user?.email?.[0].toUpperCase()}</div>
              }
              <span className="avatar-hint">Click to change photo</span>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </div>

            <div className="profile-form">
              <div className="profile-field">
                <label>Display Name</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="profile-field">
                <label>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+380..." />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input value={user?.email || ''} readOnly className="readonly-field" />
              </div>
              <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════ ADDRESSES TAB ══════════════ */}
        {tab === 'addresses' && (
          <div className="addresses-section">
            {(profile.addresses || []).length === 0 && !showAddrForm && (
              <p className="no-orders">No saved addresses yet.</p>
            )}

            <div className="addresses-list">
              {(profile.addresses || []).map(addr => (
                <div key={addr.id} className="address-card">
                  <div className="address-label">{addr.label || 'Address'}</div>
                  <p>{addr.firstName} {addr.lastName}</p>
                  <p>{addr.address}, {addr.city}</p>
                  <p>{addr.phone}</p>
                  <button className="delete-addr-btn" onClick={() => deleteAddress(addr.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {!showAddrForm ? (
              <button className="add-addr-btn" onClick={() => setShowAddrForm(true)}>
                + Add New Address
              </button>
            ) : (
              <form className="address-form" onSubmit={handleAddAddress}>
                <h3>New Address</h3>
                <div className="addr-form-grid">
                  {(['label', 'firstName', 'lastName', 'address', 'city', 'phone'] as const).map(field => (
                    <div key={field} className={`profile-field ${['address', 'label'].includes(field) ? 'full' : ''}`}>
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        required={field !== 'label'}
                        placeholder={field === 'label' ? 'e.g. Home, Work' : ''}
                        value={addrForm[field]}
                        onChange={e => setAddrForm(prev => ({ ...prev, [field]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="addr-form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddrForm(false)}>Cancel</button>
                  <button type="submit" className="save-btn">Save Address</button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
