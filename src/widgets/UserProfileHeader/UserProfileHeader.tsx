import styles from './UserProfileHeader.module.css';
import avatarEditIcon from '../../assets/images/edit (1).png';

type UserProfileHeaderProps = {
  name: string;
};

export function UserProfileHeader({ name }: UserProfileHeaderProps) {
  return (
    <aside className={styles['profile-header']} aria-label="Фото профиля">
      <div className={styles['avatar-wrap']}>
        <div className={styles.avatar} aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </div>
        <button
          type="button"
          className={styles['avatar-edit-icon']}
          aria-label="Изменить фото"
          disabled
        >
          <img src={avatarEditIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
