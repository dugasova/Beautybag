import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Select from './Select';
import type { SelectOption } from './Select';

const options: SelectOption[] = [
  { label: 'Hair', value: 'hair' },
  { label: 'Skin', value: 'skin' },
  { label: 'Body', value: 'body' },
];

describe('Select', () => {
  describe('rendering', () => {
    it('renders all options', () => {
      render(<Select options={options} />);
      expect(screen.getAllByText('Hair').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Skin')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Select options={options} label="Category" />);
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      render(<Select options={options} />);
      expect(screen.queryByText('Category')).not.toBeInTheDocument();
    });

    it('shows first option label as default display in uncontrolled mode', () => {
      render(<Select options={options} />);
      expect(screen.getByText('Hair', { selector: '.dropdown-trigger' })).toBeInTheDocument();
    });

    it('shows placeholder when controlled value does not match any option', () => {
      render(<Select options={options} value="unknown" placeholder="Pick one" />);
      expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('shows default placeholder when no custom placeholder', () => {
      render(<Select options={options} value="unknown" />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });
  });

  describe('controlled mode', () => {
    it('displays the label of the controlled value', () => {
      render(<Select options={options} value="skin" />);
      expect(screen.getByText('Skin', { selector: '.dropdown-trigger' })).toBeInTheDocument();
    });

    it('calls onChange with the option value on click', async () => {
      const onChange = vi.fn();
      render(<Select options={options} value="hair" onChange={onChange} />);
      await userEvent.click(screen.getAllByText('Skin')[0]);
      expect(onChange).toHaveBeenCalledWith('skin');
    });
  });

  describe('uncontrolled mode', () => {
    it('updates display label on click', async () => {
      render(<Select options={options} />);
      const trigger = screen.getByText('Hair', { selector: '.dropdown-trigger' });
      expect(trigger).toBeInTheDocument();

      await userEvent.click(screen.getAllByText('Body')[0]);
      expect(screen.getByText('Body', { selector: '.dropdown-trigger' })).toBeInTheDocument();
    });
  });

  describe('nested options', () => {
    const nestedOptions: SelectOption[] = [
      {
        label: 'Hair',
        value: 'hair',
        children: [
          { label: 'Shampoo', value: 'shampoo' },
          { label: 'Conditioner', value: 'conditioner' },
        ],
      },
    ];

    it('renders nested children', () => {
      render(<Select options={nestedOptions} />);
      expect(screen.getByText('Shampoo')).toBeInTheDocument();
      expect(screen.getByText('Conditioner')).toBeInTheDocument();
    });

    it('calls onChange with child value on nested click', async () => {
      const onChange = vi.fn();
      render(<Select options={nestedOptions} value="hair" onChange={onChange} />);
      await userEvent.click(screen.getByText('Shampoo'));
      expect(onChange).toHaveBeenCalledWith('shampoo');
    });
  });
});
