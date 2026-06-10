import { useState } from 'react';
import './Register.css';
import Form from '../../components/Form/Form';
import type { FormSchema } from '../../components/Form/Form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Store a profile record in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        role: "customer"
      });

      toast.success("Successfully registered!");
      navigate('/');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        toast.error(err.message || 'Registration failed');
        setError(err.message || 'Registration failed');
      } else {
        toast.error('Registration failed');
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-page'>
      <div className="container">
        <h1 className='register-title'>{t('register.title')}</h1>
        <p className='register-subtitle'>{t('register.subtitle')}</p>

        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

        <Form onSubmit={onSubmit} submitText={t('register.form.submit')} isLoading={loading} />
        <p className="register-subtitle">
          {t('register.form.redirectLink')}
          <span onClick={() => navigate('/login')}
            className="register-link" style={{ cursor: 'pointer' }}>
            {" "} Log In
          </span>
        </p>
      </div>
    </div>
  )
}