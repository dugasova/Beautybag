import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import FormField from './FormField';
import type { FieldError } from 'react-hook-form';

interface TestValues {
  name: string;
  bio: string;
}

function Wrapper({
  type = 'text',
  fieldName = 'name' as const,
  error,
  readOnly,
  placeholder,
  id,
  wrapperClassName,
  rows,
}: {
  type?: 'text' | 'email' | 'password' | 'textarea';
  fieldName?: 'name' | 'bio';
  error?: FieldError;
  readOnly?: boolean;
  placeholder?: string;
  id?: string;
  wrapperClassName?: string;
  rows?: number;
}) {
  const { control } = useForm<TestValues>({ defaultValues: { name: '', bio: '' } });
  return (
    <FormField<TestValues>
      name={fieldName}
      control={control}
      label="Name"
      type={type}
      error={error}
      readOnly={readOnly}
      placeholder={placeholder}
      id={id}
      wrapperClassName={wrapperClassName}
      rows={rows}
    />
  );
}

describe('FormField', () => {
  describe('input mode (default)', () => {
    it('renders label and input', () => {
      render(<Wrapper />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('uses label as default placeholder', () => {
      render(<Wrapper />);
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    });

    it('uses custom placeholder when provided', () => {
      render(<Wrapper placeholder="Enter your name" />);
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });

    it('applies the correct input type', () => {
      render(<Wrapper type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('supports typing', async () => {
      render(<Wrapper />);
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'Alice');
      expect(input).toHaveValue('Alice');
    });
  });

  describe('textarea mode', () => {
    it('renders a textarea when type is textarea', () => {
      render(<Wrapper type="textarea" fieldName="bio" />);
      expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
    });

    it('applies default rows=4', () => {
      render(<Wrapper type="textarea" fieldName="bio" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
    });

    it('applies custom rows', () => {
      render(<Wrapper type="textarea" fieldName="bio" rows={8} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
    });
  });

  describe('error state', () => {
    const error: FieldError = { type: 'required', message: 'Name is required' };

    it('shows error message', () => {
      render(<Wrapper error={error} />);
      expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
    });

    it('applies error class to input', () => {
      render(<Wrapper error={error} />);
      expect(screen.getByRole('textbox')).toHaveClass('error');
    });

    it('sets aria-invalid to true', () => {
      render(<Wrapper error={error} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links input to error via aria-describedby', () => {
      render(<Wrapper error={error} id="my-field" />);
      const input = screen.getByRole('textbox');
      const alert = screen.getByRole('alert');
      expect(input).toHaveAttribute('aria-describedby', 'my-field-error');
      expect(alert).toHaveAttribute('id', 'my-field-error');
    });
  });

  describe('no error state', () => {
    it('does not show error message', () => {
      render(<Wrapper />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('sets aria-invalid to false', () => {
      render(<Wrapper />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('does not set aria-describedby', () => {
      render(<Wrapper />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('readOnly', () => {
    it('applies readOnly attribute', () => {
      render(<Wrapper readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readOnly');
    });

    it('applies form-group__email class when readOnly', () => {
      render(<Wrapper readOnly />);
      expect(screen.getByRole('textbox')).toHaveClass('form-group__email');
    });
  });

  describe('custom id and wrapperClassName', () => {
    it('uses name as fallback id', () => {
      render(<Wrapper />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'name');
    });

    it('uses custom id when provided', () => {
      render(<Wrapper id="custom-id" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
    });

    it('uses custom wrapperClassName', () => {
      const { container } = render(<Wrapper wrapperClassName="my-wrapper" />);
      expect(container.querySelector('.my-wrapper')).toBeInTheDocument();
    });
  });
});
