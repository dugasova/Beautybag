import React, { useState } from 'react';
import './Select.css';

const options = [
  {
    label: 'First option',
    value: 'first-option',
    children: [
      {
        label: 'First option 1',
        value: 'first-option-1',
      },
      {
        label: 'First option 2',
        value: 'first-option-2',
      },
      {
        label: 'First option 3',
        value: 'first-option-3',
      },
    ]
  },
  {
    label: 'Second option',
    value: 'second-option',
    children: [
      {
        label: 'Second option 1',
        value: 'second-option-1',
      },
      {
        label: 'Second option 2',
        value: 'second-option-2',
      },
      {
        label: 'Second option 3',
        value: 'second-option-3',
      },
    ]
  },
  {
    label: 'Third option',
    value: 'third-option',
    children: [
      {
        label: 'Third option 1',
        value: 'third-option-1',
      },
      {
        label: 'Third option 2',
        value: 'third-option-2',
      },
      {
        label: 'Third option 3',
        value: 'third-option-3',
      },
    ]
  },
  {
    label: 'Fourth option',
    value: 'fourth-option',
    children: [
      {
        label: 'Fourth option 1',
        value: 'fourth-option-1',
      },
      {
        label: 'Fourth option 2',
        value: 'fourth-option-2',
      },
      {
        label: 'Fourth option 3',
        value: 'fourth-option-3',
      },
    ]
  },
  {
    label: 'Fifth option',
    value: 'fifth-option',
    children: [
      {
        label: 'Fifth option 1',
        value: 'fifth-option-1',
      },
      {
        label: 'Fifth option 2',
        value: 'fifth-option-2',
      },
      {
        label: 'Fifth option 3',
        value: 'fifth-option-3',
      },
    ]
  },
  {
    label: 'Sixth option',
    value: 'sixth-option',
    children: [
      {
        label: 'Sixth option 1',
        value: 'sixth-option-1',
      },
      {
        label: 'Sixth option 2',
        value: 'sixth-option-2',
      },
      {
        label: 'Sixth option 3',
        value: 'sixth-option-3',
      },
    ]
  },
];

export default function Select() {
  const [selected, setSelected] = useState('First option');

  const handleSelect = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    setSelected(value);
  };

  return (
    <div className='select-container'>
      <label>Select an option</label>

      <div className="custom-dropdown">
        <div className="dropdown-trigger">
          {selected}
        </div>
        <ul className="dropdown-options">
          {options.map((option) => (
            <li key={option.value} onClick={(e) => handleSelect(e, option.value)}>
              {option.label}
              {option.children && (
                <ul className='dropdown-options-nested'>
                  {option.children.map((child) => (
                    <li key={child.value} onClick={(e) => handleSelect(e, child.value)}>
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
  )
}
