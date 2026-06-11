import './Skeleton.css';
import { useTranslation } from 'react-i18next';

export default function Skeleton() {
  const { t } = useTranslation();

  return (
    <div className="skeleton-product-card" role="status" aria-label={t('common.loading')}>
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-content">
        <div className="skeleton-line title shimmer"></div>
        <div className="skeleton-line shimmer" style={{ width: '80%' }}></div>
        <div className="skeleton-line shimmer" style={{ width: '40%' }}></div>
        <div className="skeleton-button shimmer"></div>
      </div>
    </div>
  );
}
