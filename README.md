<div align="center"><img src="./readme/application.png" width="120" alt="StatisticApi"/></div>

<p align="center"><strong>StatisticApi</strong></p>

<p align="center">
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/></a>
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Prisma-%233982CE.svg?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
</p>

Backend API для приложения статистики. Пользователи создают проекты и метрики, отправляют в них данные и просматривают точки за выбранный период.

## Возможности

- Регистрация с подтверждением по email и авторизация.
- Управление проектами и метриками.
- Приём данных по уникальному ключу метрики.
- Получение точек за период и настройка режима отображения.
- Интерактивная документация API на Swagger.

## Технологии

NestJS · TypeScript · PostgreSQL · Prisma · Redis · Swagger

## Локальный запуск

Нужны Node.js 24+, PostgreSQL и Redis.

```bash
npm install
```

Создайте `.env.dev`/`.env.prod` с настройками приложения. Например:
```dotenv
DEV_MODE=true
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stat_api?schema=public
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
REGISTRATION_CONFIRM_FRONTEND_ENDPOINT=confirm
PORT=3000

# Каждый секрет должен содержать не менее 32 символов.
JWT_SECRET=replace-this-with-a-random-secret-at-least-32-chars
COOKIES_SECRET=replace-this-with-another-random-secret-at-least-32-chars
HASH_SECRET=replace-this-with-a-third-random-secret-at-least-32-chars

ACCESS_TOKEN_LIFETIME=900000
REFRESH_TOKEN_LIFETIME=2592000000
MAX_TOKENS_PER_USER=5
REGISTRATION_TTL_SECONDS=3600
```

Примените миграции и запустите приложение:

```bash
npx dotenv -e .env.dev -- prisma migrate deploy
npm run start:dev
```

API запускается на порту `PORT` (по умолчанию `3000`), Swagger UI доступен по адресу `/api`. Параметры SMTP для писем подтверждения регистрации задаются в `src/app.module.ts`.

