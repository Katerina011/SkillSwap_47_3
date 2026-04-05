import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './ButtonUI.module.css';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'md' | 'lg';
export type ButtonRadius = 'sm' | 'md' | 'lg' | 'full';

export interface ButtonUIProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  className?: string;
  disabled?: boolean;
}

export const ButtonUI = forwardRef<HTMLButtonElement, ButtonUIProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'lg',
      radius = 'sm',
      className = '',
      disabled = false,
      ...rest
    },
    ref,
  ) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[`size-${size}`],
      radius && styles[`rounded-${radius}`],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        type="button"
        className={buttonClasses}
        disabled={disabled}
        ref={ref}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

ButtonUI.displayName = 'ButtonUI';
