import React, { forwardRef } from 'react';
import './Input.css';

type InputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'placeholder' | 'value' | 'onChange' | 'onBlur' | 'className'>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, placeholder, value, onChange, onBlur, className, ...rest }, ref) => {
    return (
      <input
        className={`input ${type === 'email' ? 'email' : 'password'} ${className || ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
