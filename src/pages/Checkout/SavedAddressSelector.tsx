import { useTranslation } from 'react-i18next';
import type { IAddress } from '../../types';

interface SavedAddressSelectorProps {
  addresses: IAddress[];
  onSelect: (address: IAddress) => void;
}

export default function SavedAddressSelector({ addresses, onSelect }: SavedAddressSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="saved-addresses-selector">
      <h3>{t('checkout.shipping.savedAddress')}</h3>
      <div className="saved-addresses-list">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className="saved-address-chip"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(addr)}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onSelect(addr) : undefined}
          >
            <strong>{addr.label}</strong>
            <span>{addr.address}, {addr.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
