Backend API Node.js, TypeScript và tuân thủ Clean Architecture.

## 📋 Mục lục

- [Công nghệ](#công-nghệ)
- [Kiến trúc](#kiến-trúc)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [API Documentation](#api-documentation)
- [Quản lý Redis](#quản-lý-redis)
- [Scripts](#scripts)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)

---

## 🚀 Công nghệ

### Core Stack

- **Runtime**: Node.js v23+
- **Language**: TypeScript 5.9.3
- **Framework**: Express.js 5.2.1
- **Architecture**: Clean Architecture

### Database & Cache

- **Database**: MongoDB 8 (với Replica Set)
- **ORM**: Prisma 6.19.1
- **Cache**: Redis 7

### Authentication

- **Strategy**: JWT (JSON Web Tokens)
- **Session Management**: Redis-based sessions
- **Password Hashing**: bcrypt
- **OAuth**: Google OAuth 2.0 (google-auth-library)

### Validation & Documentation

- **Schema Validation**: Zod 4.2.1
- **API Documentation**: Swagger (OpenAPI 3.0)
  - swagger-jsdoc
  - swagger-ui-express

### Development Tools

- **Code Quality**: ESLint + Prettier
- **Process Manager**: Nodemon + tsx
- **Container**: Docker Compose
- **Path Aliases**: `~/` → `./src/`

---

## Kiến trúc

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (HTTP)           │
│  Controllers, Routes, Middlewares           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Application Layer (Use Cases)       │
│  DTOs, Mappers, Ports (Interfaces)          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Infrastructure Layer (External)        │
│  Repositories, Services, DB, Cache, OAuth   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Domain Layer (Business Logic)       │
│  Entities, Domain Services                  │
└─────────────────────────────────────────────┘
```

### Design Patterns

- **Dependency Injection** (DI Container)
- **Repository Pattern**
- **Ports and Adapters**
- **DTO Pattern**
- **Mapper Pattern**
- **Singleton Pattern** (Database clients)

---

## Cài đặt

### Prerequisites

- Node.js >= 23.0
- Docker & Docker Compose
- npm hoặc yarn

### Bước 1: Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install
```

### Bước 2: Cấu hình Environment

Tạo file `.env` (hoặc copy từ `.env.example`):

```env
NODE_ENV=development
PORT=3001
FE_URL=http://localhost:5173

# Database
DATABASE_URL=mongodb://localhost:27017/bjm-course?replicaSet=rs0&directConnection=true

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-here
ACCESS_TOKEN_TTL=7200
REFRESH_TOKEN_TTL=2592000

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Google OAuth (lấy từ Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Bước 3: Start Database Services

```bash
# Start MongoDB + Redis + Redis Commander
docker compose up -d

# Kiểm tra services
docker compose ps
```

### Bước 4: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# (Optional) Push schema to database
npx prisma db push
```

### Bước 5: Start Development Server

```bash
npm run dev
```

Server sẽ chạy tại:

- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Docs**: http://localhost:3001/api-docs
- **Redis Commander**: http://localhost:8081

---

## 💻 Sử dụng

### Development

```bash
# Start dev server với hot reload
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run prettier
npm run prettier:fix
```

### Database Commands

```bash
# Generate Prisma Client sau khi thay đổi schema
npx prisma generate

# Sync schema với database (development)
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio

# Format schema file
npx prisma format
```

### Docker Commands

```bash
# Start all services
docker compose up -d
---

## 📚 API Documentation

### Swagger UI

Truy cập **http://localhost:3001/api-docs** để xem interactive API documentation.

### Endpoints Overview

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/register` | ❌ | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | ❌ | Đăng nhập với email/password |
| POST | `/api/auth/login/google` | ❌ | Đăng nhập với Google OAuth |
| POST | `/api/auth/logout` | ✅ | Đăng xuất (xóa session) |
| GET | `/api/auth/me` | ✅ | Lấy thông tin user hiện tại |
| GET | `/health` | ❌ | Health check |

Truy cập **http://localhost:8081** để:
- 📋 Xem tất cả keys
- 🔍 Search/Filter keys
- 👁️ View session values
- ⏱️ Kiểm tra TTL
- ✏️ Edit/Delete keys
```
