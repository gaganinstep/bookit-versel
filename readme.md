# BookIT API

A modular, secure, and scalable backend for class and appointment booking systems. Built with Express.js, Sequelize, PostgreSQL, Redis, and supports multi-language internationalization (i18n).

---

## 🚀 Features

* Modular `modules/` structure (auth, roles, permissions, etc.)
* JWT-based authentication
* Sequelize ORM with CLI support
* Redis integration (for caching or job queues)
* PDF and report generation (using Puppeteer)
* i18n with support for multiple languages (e.g. `en-us`, `ar`)
* Swagger-based API documentation
* CI-ready with GitHub Actions and test coverage
* Docker and docker-compose setup

---

## 📦 Tech Stack

* **Backend**: Node.js, Express.js
* **ORM**: Sequelize
* **Database**: PostgreSQL
* **Cache/Queue**: Redis
* **Auth**: JWT
* **PDF**: Puppeteer, PDFKit
* **Validation**: Joi
* **Testing**: Jest, Supertest
* **CI/CD**: GitHub Actions

---

## 📁 Folder Structure

```bash
bookit-api/
├── config/              # DB, logger, i18n, Swagger configs
├── modules/             # Business modules (auth, role, permission)
├── routes/              # Dynamic route declarations
├── middlewares/         # Express middlewares (error, auth)
├── utils/               # Helper functions
├── locales/             # i18n translation files
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
```

---

## 🛠 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/bookitapp-aicha/bookit-api.git
cd bookit-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit values in .env
```

### 4. Run the Server

```bash
npm run dev
```

### 5. Swagger Docs

```bash
npm run generate-swagger
# Access at: http://localhost:3000/api-docs
```

---

## 🧪 Testing

```bash
npm test
npm run lint
```

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

---

## 🧠 Useful Scripts

```bash
npm run db:create      # Create DB
npm run db:migrate     # Apply migrations
npm run db:seeds       # Seed data
npm run db:check       # Check database connectivity
npm run lint:fix 

# Basic health check
curl http://localhost:5001/health
# Database-specific health check
curl http://localhost:5001/health/db
# Full system health check
curl http://localhost:5001/health/full      # Fix linter issues
```

---

sudo fuser -k 3001/tcp
kill -9 $(lsof -t -i :3001)



-- Step 1: Terminate connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bookit';

-- Step 2: Drop the database
DROP DATABASE bookit;