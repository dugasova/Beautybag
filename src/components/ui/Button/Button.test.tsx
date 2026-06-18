import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with text prop', () => {
    render(<Button text="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders children over text prop', () => {
    render(<Button text="Fallback"><span>Child</span></Button>);
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.queryByText('Fallback')).not.toBeInTheDocument();
  });

  it('applies default classes (primary, md, no pill)', () => {
    render(<Button text="Default" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('button-primary');
    expect(btn.className).toContain('button-md');
    expect(btn.className).not.toContain('button-pill');
  });

  it('applies variant class', () => {
    render(<Button text="Ghost" variant="ghost" />);
    expect(screen.getByRole('button').className).toContain('button-ghost');
  });

  it('applies size class', () => {
    render(<Button text="Large" size="lg" />);
    expect(screen.getByRole('button').className).toContain('button-lg');
  });

  it('applies pill class when pill=true', () => {
    render(<Button text="Pill" pill />);
    expect(screen.getByRole('button').className).toContain('button-pill');
  });

  it('merges custom className', () => {
    render(<Button text="Custom" className="my-class" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('my-class');
    expect(btn.className).toContain('button-primary');
  });

  it('calls onClick handler', async () => {
    const onClick = vi.fn();
    render(<Button text="Click" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports disabled state', () => {
    render(<Button text="Disabled" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
