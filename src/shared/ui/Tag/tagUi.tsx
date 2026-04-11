import type { ReactNode } from 'react';
import cn from 'clsx';
import styles from './tag.module.css';

export type TSkillVariant =
  | 'business'
  | 'creative'
  | 'languages'
  | 'home'
  | 'education'
  | 'health'
  | 'other';

export interface ITagUIProps {
  children: ReactNode;
  variant: TSkillVariant;
  className?: string;
}

function TagUI({ children, variant, className }: ITagUIProps) {
function TagUI({ children, variant, className = '' }: ITagUIProps) {
  return (
    <span className={cn(styles.tag, styles[variant], className)}>
      {children}
    </span>
  );
}

TagUI.defaultProps = {
  className: undefined,
  className: '',
};

export default TagUI;
