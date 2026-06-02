# Backend Structure

Project layout overview:

```text
backend/
├── .env / .env.example
├── .gitignore
├── package.json
└── src/
    ├── app.js               <- Express app (CORS, helmet, compression, routes)
    ├── server.js            <- HTTP server + graceful shutdown
    ├── config/index.js      <- Validated env config (fails fast if missing)
    ├── controllers/
    │   └── auth.controller.js
    ├── middleware/
    │   ├── auth.js          <- JWT verify -> req.user
    │   ├── errorHandler.js  <- Global error envelope
    │   ├── rateLimiter.js   <- Global + strict auth limiter
    │   ├── requestLogger.js <- Structured request log
    │   └── validate.js      <- express-validator error collector
    ├── routes/
    │   ├── index.js
    │   └── v1/
    │       ├── index.js
    │       └── auth.routes.js
    ├── services/
    │   └── auth.service.js  <- Business logic (swap in-memory store for DB)
    ├── utils/
    │   ├── ApiError.js      <- Typed operational errors
    │   ├── ApiResponse.js   <- Consistent response envelope
    │   └── catchAsync.js    <- Async route error propagation
    └── validators/
        └── auth.validator.js
```

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | /api/v1/auth/login | Public | Returns JWT + user object |
| GET | /api/v1/auth/me | Protected | Returns current user profile |
| POST | /api/v1/auth/logout | Protected | Clears session |
| GET | /health | Public | Health check |

## POST Request Payloads

## MSSQL With Sequelize

This project now includes Sequelize configured for SQL Server (MSSQL) using the `tedious` driver.

1. Install dependencies (already added to `package.json`):

```bash
npm install
```

2. Configure database environment variables in `.env`:

```env
DB_ENABLED=true
DB_HOST=localhost
DB_PORT=1433
DB_NAME=adverse_section
DB_USER=sa
DB_PASSWORD=your_password
DB_ENCRYPT=true
DB_TRUST_SERVER_CERT=true
```

3. Start the API. On startup, the server will run a Sequelize authentication check.

```bash
npm run dev
```

### POST /api/v1/auth/login

```json
{
    "username": "admin",
    "password": "admin123"
}
```

### POST /api/v1/auth/logout

No request body is required.

```json
{}
```