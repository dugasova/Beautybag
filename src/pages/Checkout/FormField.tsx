import { Controller } from 'react-hook-form';
import type { Control, FieldError } from 'react-hook-form';
import type { ShippingFormValues } from '../../hooks/useCheckout';

interface FormFieldProps {
  name: keyof ShippingFormValues;
  control: Control<ShippingFormValues>;
  label: string;
  error?: FieldError;
  type?: 'text' | 'email';
  readOnly?: boolean;
  wrapperClassName?: string;
}

export default function FormField({ name, control, label, error, type = 'text', readOnly, wrapperClassName }: FormFieldProps) {
  return (
    <div className={`form-group${wrapperClassName ? ` ${wrapperClassName}` : ''}`}>
      <label>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type={type}
            placeholder={label}
            id={name}
            {...field}
            readOnly={readOnly}
            className={readOnly ? 'form-group__email' : error ? 'error' : ''}
          />
        )}
      />
      {error && <span className="error-text">{error.message}</span>}
    </div>
  );
}
