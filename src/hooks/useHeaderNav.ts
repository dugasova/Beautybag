import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function useHeaderNav() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const navItems = [
    { id: 1, label: t('navigation.promotions', 'Promotions'), path: '/promotions' },
    { id: 2, label: t('navigation.delivery', 'Delivery and payments'), path: '/delivery' },
    { id: 3, label: t('navigation.contact', 'Contact'), path: '/contact' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleLanguage = () => {
    const currentLang = i18n.language || 'en';
    const newLang = currentLang.startsWith('en') ? 'uk' : 'en';
    i18n.changeLanguage(newLang);
  };

  const langLabel = i18n.language?.startsWith('en') ? 'UK' : 'EN';

  return { navItems, handleNavigate, toggleLanguage, langLabel };
}
