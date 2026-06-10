import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import './Button.css';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  text?: string;
}

export default function Button({
  text,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  pill = false,
  ...props
}: ButtonProps) {
  const variantClass = `button-${variant}`;
  const sizeClass = `button-${size}`;
  const pillClass = pill ? 'button-pill' : '';

  return (
    <motion.button
      whileHover={props.disabled ? undefined : { scale: 1.02 }}
      whileTap={props.disabled ? undefined : { scale: 0.98 }}
      className={`button ${variantClass} ${sizeClass} ${pillClass} ${className}`.trim()}
      {...props}
    >
      {children || text}
    </motion.button>
  );
}
