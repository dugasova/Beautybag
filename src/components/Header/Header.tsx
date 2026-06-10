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
import { useHeaderNav } from '../../hooks/useHeaderNav';

export default function Header() {
  const navigate = useNavigate();
  const { user, logOut } = UserAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { navItems, handleNavigate, toggleLanguage, langLabel } = useHeaderNav();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
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
              {langLabel}
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
