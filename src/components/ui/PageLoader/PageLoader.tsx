import './PageLoader.css';
import { useTranslation } from 'react-i18next';

export default function PageLoader() {
  const { t } = useTranslation();

  return (
    <div className="page-loader" role="status" aria-label={t('common.loading')}>
      <div className="spinner"></div>
    </div>
  );
}
