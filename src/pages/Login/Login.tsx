import { useState } from 'react';
import './Login.css';
import Form from '../../components/Form/Form';
import type { FormSchema } from '../../components/Form/Form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const redirectTo = (location.state as { prevPath?: string })?.prevPath || '/';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Successfully logged in!");
      navigate(redirectTo, { replace: true });
    } catch {
      toast.error("Invalid email or password");
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className="container">
        <h1 className="login-title">{t('login.title')}</h1>
        <p className="login-subtitle">{t('login.subtitle')}</p>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <Form onSubmit={onSubmit} submitText={t('login.form.submit')} isLoading={loading} />
        <p className="login-subtitle">
          {t('login.form.redirectLink')}
          <span onClick={() => navigate('/register')}
            className="login-link" style={{ cursor: 'pointer' }}>
            {" "} Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}
