import './Contact.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button/Button';
import FormField from '../../components/ui/FormField/FormField';

const ContactSchema = z.object({
  name:    z.string().min(2),
  email:   z.email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook',  href: 'https://facebook.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
];

export default function Contact() {
  const { t } = useTranslation();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = () => {
    toast.success(t('contact.form.success'));
    reset();
  };

  return (
    <div className="contact-page">
      <section className="container">
        <div className="contact-header">
          <h1 className="contact-title">{t('contact.title')}</h1>
          <p className="contact-subtitle">{t('contact.subtitle')}</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-item">
              <h3>{t('contact.boutique')}</h3>
              <p>{t('contact.boutiqueAddress')}</p>
            </div>
            <div className="info-item">
              <h3>{t('contact.support')}</h3>
              <p>{t('contact.supportHours')}</p>
              <p>+380 (44) 123-45-67</p>
              <p>support@beautybag.com</p>
            </div>
            <div className="info-item">
              <h3>{t('contact.followUs')}</h3>
              <div className="social-links">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
            <FormField name="name"    control={control} label={t('contact.form.name')}    error={errors.name}    placeholder={t('contact.form.namePlaceholder')} />
            <FormField name="email"   control={control} label={t('contact.form.email')}   error={errors.email}   placeholder={t('contact.form.emailPlaceholder')} type="email" />
            <FormField name="subject" control={control} label={t('contact.form.subject')}                        placeholder={t('contact.form.subjectPlaceholder')} />
            <FormField name="message" control={control} label={t('contact.form.message')} error={errors.message} placeholder={t('contact.form.messagePlaceholder')} type="textarea" rows={5} />
            <Button type="submit" variant="purple" size="lg">
              {t('contact.form.send')}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
