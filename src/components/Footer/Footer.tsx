import './Footer.css';
import { SlSocialInstagram } from "react-icons/sl";
import { SlSocialFacebook } from "react-icons/sl";
import { TiSocialPinterest } from "react-icons/ti";
import { SlSocialYoutube } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className='footer'>
      <div className="footer-top">
        <h2>{t('footer.subscribe')}</h2>
        <div className="footer-top-actions">
          <input type="text" placeholder={t('footer.subscribePlaceholder')} />
          <button>{t('footer.subscribeBtn')}</button>
        </div>
        <div className="social-icons">
          <a href="https://www.instagram.com/"><SlSocialInstagram className='social-icon' size={24} /></a>
          <a href="https://www.facebook.com/"><SlSocialFacebook className='social-icon' size={24} /></a>
          <a href="https://www.pinterest.com/"><TiSocialPinterest className='social-icon' size={24} /></a>
          <a href="https://www.youtube.com/"><SlSocialYoutube className='social-icon' size={24} /></a>
        </div>
      </div>
      <div className="footer-content">
        <ul className="footer-section">
          <li><Link className='footer-link' to="/delivery">{t('footer.aboutDelivery')}</Link></li>
          <li><Link className='footer-link' to="/products">{t('footer.aboutProducts')}</Link></li>

        </ul>
        <ul className="footer-section">
          <li><Link className='footer-link' to="/articles">{t('footer.articles')}</Link></li>
          <li><Link className='footer-link' to="/special-offers">{t('footer.specialOffers')}</Link></li>
          <li><Link className='footer-link' to="/beautybag-premium">{t('footer.beautybagPremium')}</Link></li>
        </ul>
        <ul className="footer-section">
          <li><Link className='footer-link' to="/beautybag-rewards">{t('footer.beautybagRewards')}</Link></li>
          <li><Link className='footer-link' to="/terms-of-use">{t('footer.termsOfUse')}</Link></li>
          <li><Link className='footer-link' to="/returns-and-exchanges">{t('footer.returnsAndExchanges')}</Link></li>
        </ul>
        <ul className="footer-section">
          <li><Link className='footer-link' to="/about-us">{t('footer.aboutUs')}</Link></li>
          <li><Link className='footer-link' to="/contact">{t('footer.contact')}</Link></li>
          <li><Link className='footer-link' to="/privacy-policy">{t('footer.privacyPolicy')}</Link></li>
          <li><Link className='footer-link' to="/affiliate-program">{t('footer.affiliateProgram')}</Link></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p className='footer-section-copyright'><Link className='footer-link' to="/copyright">© {new Date().getFullYear()} {t('footer.copyright')}</Link></p>
      </div>
    </footer>
  )
}