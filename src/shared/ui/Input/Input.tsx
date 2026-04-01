// src/shared/ui/Input/Input.tsx
import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Input({
className = '', disabled = false, error = false
}: InputProps) {
    const inputClasses = [
      styles.input,
      disabled && styles.disabled,
      error && styles.error,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <input
        className={inputClasses}
        disabled={disabled}
        aria-invalid={error}
      />
    );
  }

Input.defaultProps = {
  error: false,
  className: '',
  disabled: false,
};