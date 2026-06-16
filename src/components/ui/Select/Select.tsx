import React, { useState } from 'react';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
  children?: Omit<SelectOption, 'children'>[];
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function Select({ options, value, onChange, label, placeholder = 'Select an option' }: SelectProps) {
  const [internalValue, setInternalValue] = useState(options[0]?.label ?? '');

  const displayLabel = value !== undefined
    ? (options.find(o => o.value === value)?.label ?? placeholder)
    : internalValue;

  const handleSelect = (e: React.MouseEvent, option: SelectOption) => {
    e.stopPropagation();
    if (onChange) {
      onChange(option.value);
    } else {
      setInternalValue(option.label);
    }
  };

  return (
    <div className='select-container'>
      {label && <label>{label}</label>}
      <div className="custom-dropdown">
        <div className="dropdown-trigger">
          {displayLabel}
        </div>
        <ul className="dropdown-options">
          {options.map((option) => (
            <li key={option.value} onClick={(e) => handleSelect(e, option)}>
              {option.label}
              {option.children && (
                <ul className='dropdown-options-nested'>
                  {option.children.map((child) => (
                    <li key={child.value} onClick={(e) => handleSelect(e, child)}>
                      {child.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
