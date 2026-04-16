# SkillSwap_47_3

Учебный SPA-проект SkillSwap (обмен навыками) на `React + TypeScript + Vite`.

Репозиторий: [PM-YandexPracticum/SkillSwap_47_3](https://github.com/PM-YandexPracticum/SkillSwap_47_3)

## Стек

- React 19
- TypeScript 5
- Vite 8
- React Router v6
- Jest + ts-jest
- ESLint + Prettier + Stylelint

## Требования

- Node.js 20+
- npm 10+

## Установка

```bash
npm ci
```

## Запуск

```bash
npm run dev
```

В терминале открой URL из строки `Local:` (обычно `http://localhost:5173/`).

## Сборка и проверка

```bash
npm run lint
npm run format:check
npm run lint:css
npm run build
npm run test
```

## Скрипты

| Команда                | Назначение                          |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | запуск dev-сервера                  |
| `npm run build`        | `tsc --noEmit` + production build   |
| `npm run preview`      | просмотр production-сборки          |
| `npm run lint`         | ESLint для `.ts/.tsx`               |
| `npm run format:check` | проверка форматирования Prettier    |
| `npm run format`       | автоформатирование Prettier         |
| `npm run lint:css`     | Stylelint для `src/**/*.{css,scss}` |
| `npm run test`         | запуск Jest-тестов                  |

## Структура проекта

| Папка          | Назначение                                               |
| -------------- | -------------------------------------------------------- |
| `src/app`      | инициализация приложения, роутинг, глобальные стили      |
| `src/api`      | endpoint-слой работы с мок-данными                       |
| `src/entities` | доменные типы (`user`, `skill`, `request`)               |
| `src/features` | бизнес-фичи (`auth`, `catalog`, `favorites`, `requests`) |
| `src/widgets`  | крупные UI-блоки                                         |
| `src/pages`    | страницы и route-level компоненты                        |
| `src/shared`   | общий UI, хуки и утилиты                                 |

## Данные

Основные моки:

- `public/db/users.json`
- `public/db/skills.json`

## Роуты (актуально)

- `/`, `/catalog` — каталог
- `/skill/:id` — страница навыка
- `/profile`, `/user/:id` — профиль
- `/favorites` — избранное
- `/login`, `/register`, `/register/step2`, `/register/step3` — auth flow
- `/about`, `/contacts`, `/blog`, `/terms`, `/privacy` — статические страницы
- `*` — 404

## Текущее состояние функционала (кратко)

Реализовано:

- каталог + фильтры + поиск;
- карточка навыка;
- auth/регистрация;
- профиль и избранное;
- базовая логика заявок;
- lazy-loading основных маршрутов.

Не завершено:

- полный end-to-end UI флоу заявок/обменов в профиле;
- покрытие тестами на уровне целевого KPI.
