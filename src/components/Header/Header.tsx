import './Header.css';
import logo from '../../assets/icons/logo.jpg';
import Subheader from './Subheader';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button/Button';
import { UserAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { FiAlignLeft } from "react-icons/fi";
import MobileMenu from '../MobileMenu/MobileMenu';

export default function Header() {
  const navigate = useNavigate();
  const { user, logOut } = UserAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

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
      <div className='header-wrapper'>
        <header className='header container'>
          <div className='logo'>
            <NavLink to="/">
              <img src={logo} alt="logo" className='logo-img' />
            </NavLink>
          </div>
          <div className='nav'>
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
          </div>
          <div className='actions'>
            <Button
              className='language-btn-custom'
              variant="secondary"
              size="sm"
              onClick={toggleLanguage}
            >
              {i18n.language?.startsWith('en') ? 'UK' : 'EN'}
            </Button>
            {user?.email ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigate('/account')}
                >
                  {t('header.account')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleLogout}
                >
                  {t('header.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate('/login')}
                >
                  {t('header.login')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleNavigate('/register')}
                >
                  {t('header.signup')}
                </Button>
              </>
            )}
            {/* mobile menu button */}
            <FiAlignLeft
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(true)}
            />
            {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
          </div>
          <Subheader />
        </header >
      </div>
    </>
  )
}
