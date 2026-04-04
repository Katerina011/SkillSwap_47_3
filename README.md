# SkillSwap

Базовый старт проекта на `React + TypeScript + Vite`.

## Требования

- `Node.js` 20+
- `npm` 10+

## Установка

```bash
npm install
```

## Как мы ведём Git

- **`main`** — стабильная ветка, содержит только готовый к продакшену код.
- **`develop`** — основная ветка для разработки. Никакие изменения не вносятся напрямую — только через Pull Request (PR).

Ветку задачи создаём от **`develop`**, PR открываем **в `develop`**.

## Запуск в development

```bash
npm run dev
```

После запуска откройте в браузере адрес, который выведет Vite в терминале (строка `Local:`).

## Основные команды

- `npm run dev` — локальный сервер разработки
- `npm run build` — проверка TypeScript и production-сборка
- `npm run lint` — проверка ESLint
- `npm run test` — запуск Jest (сейчас без тестов завершается успешно)

## Пустые папки и `.gitkeep`

Git не хранит пустые каталоги. Файлы `.gitkeep` — это заглушки, чтобы нужная структура папок попадала в репозиторий.

## Что уже подключено (базовый набор под MVP проекта)

- React, React DOM, React Router
- Redux Toolkit + React Redux
- Axios
- ESLint (Airbnb + TypeScript)
- Prettier
- Stylelint
- Jest + React Testing Library

## Проверка кода перед PR

Перед отправкой Pull Request рекомендуется запустить:

- `npm run lint` — проверка TS/TSX через ESLint
- `npm run lint:css` — проверка стилей через Stylelint
- `npm run format:check` — проверка форматирования через Prettier

Для автоматического форматирования можно использовать:

- `npm run format`
- На pull request в `develop` и `main` запускаются проверки: `npm ci`, `npm run lint`, `npm run format:check`, `npm run lint:css`, `npm run build`, `npm test`.
