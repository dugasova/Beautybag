import './MobileMenu.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, NavLink } from 'react-router-dom';
import Button from '../ui/Button/Button';
import logo from '../../assets/icons/logo.jpg';
import { IoCloseSharp } from "react-icons/io5";
import { SlSocialInstagram } from "react-icons/sl";
import { SlSocialFacebook } from "react-icons/sl";
import { TiSocialPinterest } from "react-icons/ti";
import { SlSocialYoutube } from "react-icons/sl";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const navItems = [
    { id: 1, label: t('navigation.promotions', 'Promotions'), path: '/promotions' },
    { id: 2, label: t('navigation.delivery', 'Delivery and payments'), path: '/delivery' },
    { id: 3, label: t('navigation.contact', 'Contact'), path: '/contact' },
  ]
  const handleNavigate = (path: string) => {
    navigate(path);
  }
  const toggleLanguage = () => {
    const currentLang = i18n.language || 'en';
    const newLang = currentLang.startsWith('en') ? 'uk' : 'en';
    i18n.changeLanguage(newLang);
  }
  return (
    <>
      <div className="mobile-menu-container" onClick={onClose}>
        <div className="mobile-menu" >
          <div className="mobile-menu-header">
            <div className='logo' onClick={() => handleNavigate('/')}>
              <img src={logo} alt="logo" className='logo-img' />
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/login')}
              >
                {t('header.login')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
              >
                {i18n.language?.startsWith('en') ? 'UK' : 'EN'}
              </Button>

            </div>
          </div>
          <div className='nav-list'>
            <ul className='nav-list'>
              {navItems.map((item) => (
                <li key={item.id} className='nav-item'>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <IoCloseSharp
              className="mobile-menu-close-btn"
              onClick={onClose}
            />
          </div>
          {/* social icons */}
          <div className='social-icons'>
            <a href="https://www.instagram.com/"><SlSocialInstagram className='social-icon' size={24} /></a>
            <a href="https://www.facebook.com/"><SlSocialFacebook className='social-icon' size={24} /></a>
            <a href="https://www.pinterest.com/"><TiSocialPinterest className='social-icon' size={24} /></a>
            <a href="https://www.youtube.com/"><SlSocialYoutube className='social-icon' size={24} /></a>
          </div>
        </div>
      </div>
    </>
  )
}
