import React, { forwardRef } from 'react';
import './Input.css';

type InputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, placeholder, value, onChange, onBlur, className }, ref) => {
    return (
      <input
        className={`input ${type === 'email' ? 'email' : 'password'} ${className || ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
