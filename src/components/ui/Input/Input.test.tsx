import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input';

const defaultProps = {
  type: 'text',
  placeholder: 'Enter value',
  value: '',
  onChange: vi.fn(),
  onBlur: vi.fn(),
};

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('displays the value', () => {
    render(<Input {...defaultProps} value="hello" />);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });

  it('calls onChange on typing', async () => {
    const onChange = vi.fn();
    render(<Input {...defaultProps} onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText('Enter value'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onBlur when focus leaves', async () => {
    const onBlur = vi.fn();
    render(<Input {...defaultProps} onBlur={onBlur} />);
    const input = screen.getByPlaceholderText('Enter value');
    await userEvent.click(input);
    await userEvent.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  it('applies "email" class for type email', () => {
    render(<Input {...defaultProps} type="email" />);
    const input = screen.getByPlaceholderText('Enter value');
    expect(input.className).toContain('email');
  });

  it('applies "password" class for type password', () => {
    render(<Input {...defaultProps} type="password" />);
    const input = screen.getByPlaceholderText('Enter value');
    expect(input.className).toContain('password');
  });

  it('merges custom className', () => {
    render(<Input {...defaultProps} className="custom" />);
    const input = screen.getByPlaceholderText('Enter value');
    expect(input.className).toContain('input');
    expect(input.className).toContain('custom');
  });

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement | null>;
    render(<Input {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
