import { Controller } from 'react-hook-form';
import type { FieldValues, Path, Control, FieldError } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: FieldError;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  readOnly?: boolean;
  wrapperClassName?: string;
  rows?: number;
}

export default function FormField<T extends FieldValues>({
  name,
  control,
  label,
  error,
  id,
  type = 'text',
  placeholder,
  readOnly,
  wrapperClassName = 'form-group',
  rows = 4,
}: FormFieldProps<T>) {
  const fieldId = id ?? name;
  const errorId = `${fieldId}-error`;

  return (
    <div className={wrapperClassName}>
      <label htmlFor={fieldId}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          type === 'textarea' ? (
            <textarea
              {...field}
              value={field.value ?? ''}
              id={fieldId}
              placeholder={placeholder ?? label}
              rows={rows}
              className={error ? 'error' : ''}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
          ) : (
            <input
              {...field}
              value={field.value ?? ''}
              id={fieldId}
              type={type}
              placeholder={placeholder ?? label}
              readOnly={readOnly}
              className={readOnly ? 'form-group__email' : error ? 'error' : ''}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
          )
        }
      />
      {error && <span id={errorId} className="error-text" role="alert">{error.message}</span>}
    </div>
  );
}
