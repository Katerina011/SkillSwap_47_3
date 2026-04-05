// src/shared/ui/Input/Input.tsx
import React from 'react';
import styles from './InputUI.module.css';

export interface InputUIProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
  disabled?: boolean;
}

export const InputUI = React.forwardRef<HTMLInputElement, InputUIProps>(
  ({ className = '', disabled = false, error = false, ...rest }, ref) => {
    // Формируем классы
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
        ref={ref}
        className={inputClasses}
        disabled={disabled}
        aria-invalid={error}
        {...rest} // пробрасываем все остальные пропсы (value, onChange, placeholder и т.д.)
      />
    );
  },
);

InputUI.displayName = 'InputUI';

InputUI.defaultProps = {
  error: false,
  className: '',
  disabled: false,
};
