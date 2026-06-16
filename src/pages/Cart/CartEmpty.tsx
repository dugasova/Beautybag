import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button/Button';
import { useNavigate } from 'react-router-dom';

export default function CartEmpty() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className='cart-empty'>
      <h1>{t('cart.empty')}</h1>
      <div className='empty-cart-icon'>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 19.9C5.58 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.42 15.36 13.45 19.9L12 21.35Z" fill="#a855f7" />
        </svg>
      </div>
      <p className='empty-msg'>{t('cart.emptyMessage')}</p>
      <Button variant="purple" size="md" onClick={() => navigate('/')}>{t('cart.backToProducts')}</Button>
    </div>
  )
}
