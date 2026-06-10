import './Contact.css';
import Button from '../../components/ui/Button/Button';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <section className="container">
        <div className="contact-header">
          <h1 className="contact-title">{t('navigation.contact', 'Contact Us')}</h1>
          <p className="contact-subtitle">We would love to hear from you. Send us a message!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <h3>Our Boutique</h3>
              <p>123 Beauty Lane, Glow City, 10101</p>
            </div>
            <div className="info-item">
              <h3>Customer Support</h3>
              <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p>+380 (44) 123-45-67</p>
              <p>support@beautybag.com</p>
            </div>
            <div className="info-item">
              <h3>Follow Us</h3>
              <div className="social-links">
                <span>Instagram</span>
                <span>Facebook</span>
                <span>Pinterest</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" placeholder="What is this about?" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={5} placeholder="Write your message here..." required></textarea>
            </div>
            <Button type="submit" variant="purple" size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}