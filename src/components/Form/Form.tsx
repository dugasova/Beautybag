import './Form.css';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

const schema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('login.validation.invalidEmail') || 'Invalid email'),
  password: z.string().min(6, t('login.validation.passwordMin') || 'Password must be at least 6 characters long').max(12, t('login.validation.passwordMax') || 'Password must be at most 12 characters long'),
})
export type FormSchema = {
  email: string;
  password: string;
}
type FormProps = {
  onSubmit: (data: FormSchema) => void;
  submitText: string;
  isLoading: boolean;
  formClassName?: string;
  inputClassName?: string;
  submitClassName?: string;
}
import Input from '../ui/Input/Input';
import Button from '../ui/Button/Button';

export default function Form({
  onSubmit,
  submitText,
  isLoading,
  formClassName = '',
  inputClassName = '',
  submitClassName = ''
}: FormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { isValid, errors } } = useForm<FormSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(schema(t)),
  })

  return (
    <form className={`base-form ${formClassName}`} onSubmit={handleSubmit(onSubmit)}>
      <div className="form-field">
        <label htmlFor="email" className="sr-only">{t('login.form.email') || 'Email'}</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder={t('login.form.email') || 'Email'}
              className={`${inputClassName} ${errors.email ? 'has-error' : ''}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          )}
        />
        {errors.email && <span id="email-error" className="error-message" role="alert">{errors.email.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="password" className="sr-only">{t('login.form.password') || 'Password'}</label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="password"
              type="password"
              placeholder={t('login.form.password') || 'Password'}
              className={`${inputClassName} ${errors.password ? 'has-error' : ''}`}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
          )}
        />
        {errors.password && <span id="password-error" className="error-message" role="alert">{errors.password.message}</span>}
      </div>

      <Button
        type="submit"
        variant="purple"
        size="lg"
        disabled={!isValid || isLoading}
        className={submitClassName}
      >
        {isLoading ? '...' : submitText}
      </Button>
    </form>
  )
}
