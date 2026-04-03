import { type FC } from 'react';
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
  children: React.ReactNode;
  variant: TSkillVariant;
  className?: string;
}

const TagUI: FC<ITagUIProps> = ({ children, variant, className }) => {
  return (
    <span className={cn(styles.tag, variant && styles[variant], className)}>
      {children}
    </span>
  );
};

export default TagUI;
