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
