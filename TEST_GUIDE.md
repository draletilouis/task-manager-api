# Auth Module Testing Guide

## Setup Complete ✅

All potential issues have been fixed and the auth module is ready for testing!

## What Was Fixed

1. ✅ **Input Validation** - Email format and password strength validation
2. ✅ **Duplicate Email Check** - Prevents duplicate registrations
3. ✅ **Refresh Token Endpoint** - `/auth/refresh` endpoint added
4. ✅ **Error Handling** - All controllers wrapped in try-catch
5. ✅ **Prisma Singleton** - Shared Prisma client instance
6. ✅ **TypeScript Compilation** - All type errors resolved
7. ✅ **ES Module Support** - Added `"type": "module"` to package.json
8. ✅ **JWT Secrets** - Added to .env file

## Prerequisites

1. **Database Setup**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Start Server**
   ```bash
   npm run dev
   # or
   npx ts-node-dev src/server.ts
   ```

## API Endpoints

### 1. Register User
**POST** `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Validations:**
- Email must be valid format
- Password must be at least 8 characters
- Password must contain: uppercase, lowercase, and number

**Success Response (201):**
```json
{
  "message": "User registered",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "timestamp"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email format"
}
```
or
```json
{
  "error": "Password must contain at least one uppercase letter"
}
```
or
```json
{
  "error": "Email already registered"
}
```

### 2. Login
**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "accessToken": "jwt-token-15min",
  "refreshToken": "jwt-token-7days"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

### 3. Refresh Token
**POST** `/auth/refresh`

```json
{
  "refreshToken": "your-refresh-token"
}
```

**Success Response (200):**
```json
{
  "accessToken": "new-jwt-token-15min"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired refresh token"
}
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

### Refresh
```bash
curl -X POST http://localhost:5000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN_HERE"}'
```

### Protected Route Example (Workspace)
```bash
curl -X POST http://localhost:5000/workspaces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{"name":"My Workspace"}'
```

## Testing with Postman/Thunder Client

1. Create a new request collection
2. Add the above endpoints
3. Test the full flow:
   - Register a user
   - Login with credentials
   - Save the tokens
   - Use access token for protected routes
   - Refresh token when access token expires

## Validation Tests

### Email Validation
- ❌ `invalidemail` - should fail
- ❌ `test@` - should fail
- ❌ `@example.com` - should fail
- ✅ `test@example.com` - should pass

### Password Validation
- ❌ `short` - too short
- ❌ `alllowercase123` - no uppercase
- ❌ `ALLUPPERCASE123` - no lowercase
- ❌ `NoNumbers` - no numbers
- ✅ `ValidPass123` - should pass

## Environment Variables

Make sure these are set in your `.env` file:
```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this-in-production"
```

⚠️ **Important:** Change the JWT secrets in production!

## File Structure

```
src/
├── modules/
│   └── auth/
│       ├── auth.service.ts      # Business logic with validation
│       ├── auth.controller.ts   # Request handlers with error handling
│       ├── auth.routes.ts       # Route definitions
│       └── auth.middleware.ts   # JWT verification middleware
├── database/
│   └── prisma.ts               # Shared Prisma client singleton
├── shared/
│   └── utils/
│       └── validation.ts        # Email & password validation
└── types/
    └── express.d.ts            # Express type extensions
```

## Next Steps

1. Run database migrations
2. Start the development server
3. Test all endpoints using the examples above
4. Verify validations work as expected
5. Test the full authentication flow
