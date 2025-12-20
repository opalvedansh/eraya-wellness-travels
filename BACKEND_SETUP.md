# Backend Authentication System Setup Guide

## Overview

This project implements a complete **email-based OTP (One-Time Password) authentication system** using:
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Gmail SMTP via Nodemailer
- **Backend**: Express.js with Node.js
- **Security**: bcryptjs for OTP hashing

---

## Prerequisites

### 1. PostgreSQL Installation

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Download and install from: https://www.postgresql.org/download/windows/

### 2. Verify PostgreSQL Installation
```bash
psql --version
# Should output: psql (PostgreSQL) 15.x
```

---

## Database Setup

### Step 1: Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql terminal:
CREATE DATABASE otp_auth_db;
CREATE USER otp_user WITH PASSWORD 'otp_secure_password';
ALTER ROLE otp_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE otp_auth_db TO otp_user;
\q
```

### Step 2: Update .env Configuration

Edit `.env` file:
```env
DATABASE_URL="postgresql://otp_user:otp_secure_password@localhost:5432/otp_auth_db"
```

### Step 3: Run Prisma Migrations

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# (Optional) View database schema
pnpm prisma studio
```

### Step 4: Verify Database Setup

```bash
# Connect to database
psql -U otp_user -d otp_auth_db

# View tables
\dt

# View schema
\d "User"
\d "OTP"

# Exit
\q
```

---

## Email Configuration

### Development Mode (Console Logging)

**Current setup** - OTP codes are printed to console:

```env
EMAIL_PROVIDER=console
```

OTP codes will appear in terminal output when requested.

### Production Mode (Gmail SMTP)

#### Step 1: Set Up Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification (if not already done)
3. Go to: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer"
5. Generate and copy the 16-character password

#### Step 2: Update .env

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=erayawellnesstravels@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=erayawellnesstravels@gmail.com
```

#### Step 3: Restart Development Server

```bash
pnpm dev
```

---

## Start Development Server

```bash
pnpm dev
```

Server runs on: `http://localhost:8080`

---

## API Endpoints

### 1. Request OTP (Send OTP to Email)
```bash
POST /api/request-otp

Request Body:
{
  "email": "user@example.com"
}

Response (Success):
{
  "success": true,
  "message": "OTP sent to your email address"
}

Response (Error):
{
  "error": "Email already registered and verified"
}
```

### 2. Verify OTP (Validate OTP and Mark User Verified)
```bash
POST /api/verify-otp

Request Body:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response (Success):
{
  "success": true,
  "message": "Account verified successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "isVerified": true
  },
  "token": "token-user-id-timestamp"
}

Response (Error):
{
  "error": "Invalid OTP. Please try again."
}
```

### 3. Resend OTP
```bash
POST /api/resend-otp

Request Body:
{
  "email": "user@example.com"
}

Response (Success):
{
  "success": true,
  "message": "New OTP sent to your email address"
}

Response (Cooldown):
{
  "error": "Please wait 30 seconds before requesting a new OTP",
  "cooldownMs": 25000
}
```

---

## Testing with cURL

### Complete Flow Test

```bash
# 1. Request OTP
curl -X POST http://localhost:8080/api/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Wait for OTP code in console output

# 2. Verify OTP (replace with actual OTP)
curl -X POST http://localhost:8080/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# 3. Resend OTP (if needed)
curl -X POST http://localhost:8080/api/resend-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Database Schema

### User Table
```sql
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY DEFAULT cuid(),
  "email" TEXT UNIQUE NOT NULL,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
```

### OTP Table
```sql
CREATE TABLE "OTP" (
  "id" TEXT PRIMARY KEY DEFAULT cuid(),
  "email" TEXT NOT NULL,
  "otpHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT
);

CREATE INDEX "OTP_email_idx" ON "OTP"("email");
CREATE INDEX "OTP_expiresAt_idx" ON "OTP"("expiresAt");
```

---

## Architecture

### File Structure
```
server/
├── routes/
│   └── auth.ts                 # API endpoints
├── services/
│   ├── otp.ts                  # OTP logic & Prisma queries
│   ├── email.ts                # Email service (Nodemailer)
│   └── dev-email-tester.ts     # Development logging
└── index.ts                    # Express setup

shared/
└── api.ts                      # Shared types

prisma/
├── schema.prisma               # Data models
└── migrations/
    └── 0_init/                 # Initial schema
```

### Key Components

#### OTP Service (`server/services/otp.ts`)
- **generateOTP()**: Creates random 6-digit code
- **hashOTP()**: Secures OTP with bcryptjs
- **initiateSignup()**: Creates user and stores hashed OTP
- **verifyOTP()**: Validates OTP, marks user verified
- **canResendOTP()**: Enforces 30-second cooldown

#### Email Service (`server/services/email.ts`)
- **sendEmail()**: Sends via Nodemailer (SMTP) or console
- **generateOTPEmailHTML()**: Creates branded email template
- Supports both development and production modes

#### Auth Routes (`server/routes/auth.ts`)
- `POST /api/request-otp`: Initiates verification
- `POST /api/verify-otp`: Completes verification
- `POST /api/resend-otp`: Requests new code (30s cooldown)

---

## Security Features

✅ **OTP Hashing**: bcryptjs (10 salt rounds)  
✅ **Unique Emails**: Database constraint enforces uniqueness  
✅ **5-Minute Expiry**: Auto-expiring tokens  
✅ **Rate Limiting**: 30-second resend cooldown  
✅ **Failed Attempt Lockout**: 5 attempts → locked out  
✅ **No Passwords**: OTP-only authentication  
✅ **Environment Variables**: Secrets never hardcoded  

---

## Production Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@prod-host:5432/otp_auth_db
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=erayawellnesstravels@gmail.com
SMTP_PASS=app-password
SMTP_FROM=erayawellnesstravels@gmail.com
NODE_ENV=production
```

### Database Migrations
```bash
# Always run migrations in production
pnpm prisma migrate deploy
```

### Deployment Platforms

**Railway** (PostgreSQL hosting)
1. Create Railway project
2. Add PostgreSQL add-on
3. Copy connection string to `DATABASE_URL`
4. Deploy application

**Supabase** (PostgreSQL hosting)
1. Create Supabase project
2. Get connection string from Settings → Database
3. Update `DATABASE_URL`
4. Deploy application

---

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution:**
- Verify PostgreSQL is running: `brew services list`
- Check DATABASE_URL in .env
- Ensure database exists: `psql -l`

### Email Not Sending
```
Error: Failed to initialize email service
```
**Solution:**
- Check SMTP credentials in .env
- Verify Gmail App Password (not regular password)
- Enable "Less secure apps" if using old Gmail account
- Check firewall/ISP blocking port 587

### Prisma Client Error
```
Error: @prisma/client package not found
```
**Solution:**
```bash
pnpm prisma generate
pnpm install
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::8080
```
**Solution:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

---

## Development Workflow

1. **Database Changes**: Edit `prisma/schema.prisma` → Run `pnpm prisma migrate dev`
2. **New API Endpoint**: Create in `server/routes/` → Import in `server/index.ts`
3. **Environment Changes**: Update `.env` → Restart dev server
4. **Type Checking**: `pnpm typecheck`
5. **Testing**: Use cURL or Postman

---

## Notes

- **Frontend**: No changes needed - OTP flow is backend-only
- **Database**: Designed for PostgreSQL (local + production)
- **Scalability**: Ready for Railway, Supabase, or AWS RDS
- **Security**: Production-ready with all best practices
