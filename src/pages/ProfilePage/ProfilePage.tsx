import { useState } from 'react';
import styles from './ProfilePage.module.css';

import calendarIcon from '../../assets/images/calendar.svg';
import chevronDownIcon from '../../assets/images/chevron-down.svg';
import editIcon from '../../assets/images/edit.svg';

import requestIcon from '../../assets/images/request.svg';
import messageIcon from '../../assets/images/message-text.svg';
import likeIcon from '../../assets/images/like.svg';
import ideaIcon from '../../assets/images/idea.svg';
import userIcon from '../../assets/images/user.svg';

import galleryEditIcon from '../../assets/images/gallery-edit.svg';

const sidebarItems = [
  { label: 'Заявки', icon: requestIcon },
  { label: 'Мои обмены', icon: messageIcon },
  { label: 'Избранное', icon: likeIcon },
  { label: 'Мои навыки', icon: ideaIcon },
  { label: 'Личные данные', icon: userIcon },
];

const profileUser = {
  name: 'Мария',
  email: 'Mariia@gmail.com',
  birthDate: '28.10.1995',
  gender: 'Женский',
  city: 'Москва',
  about: `Люблю учиться новому, особенно
если это можно делать за чаем и в пижаме.
Всегда готова пообщаться и обменяться чем-то
интересным!`,
  avatar: '/avatars/image.jpg',
};

export function ProfilePage() {
  const [avatarSrc, setAvatarSrc] = useState(profileUser.avatar);

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <aside className={styles.sidebar}>
          <nav
            className={styles['sidebar-items']}
            aria-label="Навигация профиля"
          >
            {sidebarItems.map((item) => {
              const isActive = item.label === 'Личные данные';

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`${styles['sidebar-item']} ${
                    isActive ? styles['sidebar-item-active'] : ''
                  }`}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className={styles['sidebar-icon']}
                    aria-hidden="true"
                  />
                  <span className={styles['sidebar-label']}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className={styles['user-info']}>
          <div className={styles['form-section']}>
            <div className={styles.inputs}>
              <div className={styles['input-with-link']}>
                <div className={styles.field}>
                  <span className={styles.label}>Почта</span>

                  <div className={styles['input-box']}>
                    <span className={styles['input-text']}>
                      {profileUser.email}
                    </span>
                    <img
                      src={editIcon}
                      alt=""
                      className={styles['field-icon-muted']}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <button type="button" className={styles['password-link']}>
                  Изменить пароль
                </button>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Имя</span>

                <div className={styles['input-box']}>
                  <span className={styles['input-text']}>
                    {profileUser.name}
                  </span>
                  <img
                    src={editIcon}
                    alt=""
                    className={styles['field-icon-muted']}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className={styles['row-fields']}>
                <div className={styles['field-small']}>
                  <span className={styles.label}>Дата рождения</span>

                  <div className={styles['input-box-small']}>
                    <span className={styles['input-text']}>
                      {profileUser.birthDate}
                    </span>
                    <img
                      src={calendarIcon}
                      alt=""
                      className={styles['field-icon']}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className={styles['field-small']}>
                  <span className={styles.label}>Пол</span>

                  <div className={styles['input-box-small']}>
                    <span className={styles['input-text']}>
                      {profileUser.gender}
                    </span>
                    <img
                      src={chevronDownIcon}
                      alt=""
                      className={styles['field-icon']}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Город</span>

                <div className={styles['input-box']}>
                  <span className={styles['input-text']}>
                    {profileUser.city}
                  </span>
                  <img
                    src={chevronDownIcon}
                    alt=""
                    className={styles['field-icon']}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className={styles['field-textarea']}>
                <span className={styles.label}>О себе</span>

                <div className={styles['textarea-box']}>
                  <span className={styles['textarea-text']}>
                    {profileUser.about.split('\n').map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </span>

                  <img
                    src={editIcon}
                    alt=""
                    className={styles['field-icon-muted']}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <button type="button" className={styles['save-button']}>
                Сохранить
              </button>
            </div>
          </div>

          <div className={styles['user-photo']}>
            <div className={styles['user-photo-frame']}>
              <img
                className={styles['user-photo-image']}
                src={avatarSrc}
                alt={profileUser.name}
                onError={() => setAvatarSrc('/avatars/default.jpg')}
              />
            </div>

            <button
              type="button"
              className={styles['user-photo-edit']}
              aria-label="Изменить фото"
            >
              <img
                src={galleryEditIcon}
                alt=""
                className={styles['user-photo-edit-icon']}
                aria-hidden="true"
              />
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}
