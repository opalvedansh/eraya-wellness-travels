# OTP Authentication Flow - Testing Guide

## Prerequisites
1. **PostgreSQL**: Ensure PostgreSQL is running locally on `localhost:5432`
2. **Database**: Create a database named `otp_auth_db`
3. **Environment Variables**: `.env` is configured with correct `DATABASE_URL`

## Database Setup

### Option 1: Using Prisma (Recommended)
```bash
# Generate Prisma Client
pnpm prisma generate

# Apply migrations
pnpm prisma migrate deploy

# (Optional) Reset database in development
pnpm prisma migrate reset
```

### Option 2: Manual PostgreSQL Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE otp_auth_db;

# Connect to the database
\c otp_auth_db

# Run migration
psql -U postgres -d otp_auth_db -f prisma/migrations/0_init/migration.sql
```

## Start Development Server
```bash
pnpm dev
```

The server will run on `http://localhost:8080`

## Testing the OTP Flow

### 1. Request OTP
```bash
curl -X POST http://localhost:8080/api/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email address"
}
```

**Check Console Output:**
- OTP code will be printed to console in development mode
- Check `.dev-otp-log.json` file for historical OTPs

### 2. Verify OTP
```bash
curl -X POST http://localhost:8080/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

**Expected Response (Valid OTP):**
```json
{
  "success": true,
  "message": "Account verified successfully",
  "user": {
    "id": "user-id",
    "email": "test@example.com",
    "isVerified": true
  },
  "token": "token-user-id-timestamp"
}
```

**Expected Response (Invalid/Expired OTP):**
```json
{
  "error": "Invalid OTP. Please try again." 
  OR
  "error": "OTP has expired. Please request a new one."
}
```

### 3. Resend OTP
```bash
curl -X POST http://localhost:8080/api/resend-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "New OTP sent to your email address"
}
```

**Note:** Resend has a 30-second cooldown between requests

## Test Scenarios

### Success Path
1. Request OTP for new email
2. Use OTP from console within 5 minutes
3. Verify OTP successfully
4. User marked as `isVerified: true`

### Error Handling
- **Duplicate verified email**: "Email already registered and verified"
- **Invalid email format**: "Invalid email format"
- **Expired OTP**: "OTP has expired. Please request a new one."
- **Wrong OTP**: "Invalid OTP. Please try again." (after 5 attempts, user locked out)
- **Resend cooldown**: "Please wait XX seconds before requesting a new OTP"

## Database Queries (Verification)

### Connect to database
```bash
psql -U postgres -d otp_auth_db
```

### View users
```sql
SELECT id, email, "isVerified", "createdAt" FROM "User";
```

### View OTP records
```sql
SELECT email, "otpHash", "expiresAt", "createdAt" FROM "OTP";
```

### Delete test data (reset)
```sql
DELETE FROM "OTP";
DELETE FROM "User";
```

## Environment Configuration

### Development (Console OTP)
```env
EMAIL_PROVIDER=console
DATABASE_URL=postgresql://postgres:password@localhost:5432/otp_auth_db
```

### Production (Gmail SMTP)
```env
EMAIL_PROVIDER=smtp
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=erayawellnesstravels@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM=erayawellnesstravels@gmail.com
```

**Gmail App Password Setup:**
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your OS)
4. Copy 16-character password to `SMTP_PASS`

## Architecture Overview

### Database Models
- **User**: Stores email and verification status
- **OTP**: Stores hashed OTP codes with expiry times

### API Endpoints
- `POST /api/request-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP and mark user as verified
- `POST /api/resend-otp` - Resend OTP (30s cooldown)

### Services
- **otp.ts**: Core OTP logic (generation, hashing, verification)
- **email.ts**: Email service (Nodemailer with Gmail SMTP)
- **dev-email-tester.ts**: Development OTP logging

### Key Features
- OTP hashing with bcryptjs (secure storage)
- 5-minute OTP expiry
- 30-second resend cooldown
- 5 failed attempts lockout
- Automatic cleanup of expired/verified OTPs
- Console logging in development
- Production-ready Gmail SMTP support
