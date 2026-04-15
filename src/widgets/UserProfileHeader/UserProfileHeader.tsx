import styles from './UserProfileHeader.module.css';

type UserProfileHeaderProps = {
  name: string;
  nickname: string;
  role: string;
  city: string;
};

export function UserProfileHeader({
  name,
  nickname,
  role,
  city,
}: UserProfileHeaderProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className={styles.card}>
      <div className={styles.avatar} aria-hidden="true">
        {initials}
      </div>

      <div className={styles.info}>
        <div className={styles.head}>
          <h1 className={styles.name}>{name}</h1>
          <span className={styles.nickname}>{nickname}</span>
        </div>

        <p className={styles.meta}>{role}</p>
        <p className={styles.meta}>{city}</p>
      </div>
    </section>
  );
}
