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
import { FiSun, FiMoon } from "react-icons/fi";
import { UserAuth } from '../../context/AuthContext';
import { useHeaderNav } from '../../hooks/useHeaderNav';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logOut } = UserAuth();
  const { navItems, toggleLanguage, langLabel } = useHeaderNav();
  const { theme, toggleTheme } = useTheme();
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  }
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
      onClose();
    } catch (error) {
      console.error(error);
    }
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
              {user?.email ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate('/account')}
                  >
                    {t('header.account')}
                  </Button>
                  <Button
                    variant="outline"
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
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate('/register')}
                  >
                    {t('header.signup')}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
              >
                {langLabel}
              </Button>
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
