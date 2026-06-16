import './Header.css';
import logo from '../../assets/icons/logo.jpg';
import Subheader from './Subheader';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../ui/Button/Button';
import { UserAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { FiAlignLeft, FiSun, FiMoon } from "react-icons/fi";
import MobileMenu from '../MobileMenu/MobileMenu';
import { useHeaderNav } from '../../hooks/useHeaderNav';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const { user, logOut } = UserAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { navItems, toggleLanguage, langLabel } = useHeaderNav();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch {
      toast.error(t('common.error'));
    }
  }

  const handleMenuButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsMenuOpen(true);
    }
  }

  return (
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
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={t(theme === 'dark' ? 'header.lightMode' : 'header.darkMode')}
            aria-pressed={theme === 'dark'}
          >
            <motion.span
              className="theme-toggle-thumb"
              animate={{ x: theme === 'dark' ? 22 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {theme === 'dark' ? <FiMoon /> : <FiSun />}
            </motion.span>
          </button>
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
                onClick={() => navigate('/account')}
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
                onClick={() => navigate('/login')}
              >
                {t('header.login')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                {t('header.signup')}
              </Button>
            </>
          )}
          <FiAlignLeft
            className="mobile-menu-button"
            role="button"
            tabIndex={0}
            aria-label={t('header.openMenu', 'Open menu')}
            onClick={() => setIsMenuOpen(true)}
            onKeyDown={handleMenuButtonKeyDown}
          />
          {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
        </div>
        <Subheader />
      </header>
    </div>
  )
}
