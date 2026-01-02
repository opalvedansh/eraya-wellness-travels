# Vercel Environment Variables Setup

This document lists all environment variables required for deploying your application to Vercel.

## How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below with the appropriate value
4. For each variable, select which environments it applies to:
   - **Production** (required)
   - **Preview** (recommended for testing)
   - **Development** (optional, for local Vercel dev)

---

## Required Environment Variables

### Database Configuration

```
DATABASE_URL
```
**Description**: PostgreSQL connection string from Supabase  
**Example**: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`  
**Where to get it**: Supabase Dashboard → Settings → Database → Connection String

---

### Authentication & Security

```
JWT_SECRET
```
**Description**: Secret key for signing JWT tokens  
**Example**: A secure random string (minimum 32 characters)  
**How to generate**: Run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

```
JWT_EXPIRES_IN
```
**Description**: JWT token expiration time  
**Value**: `7d`

---

### Supabase Configuration

```
VITE_SUPABASE_URL
```
**Description**: Your Supabase project URL  
**Example**: `https://your-project.supabase.co`  
**Where to get it**: Supabase Dashboard → Settings → API → Project URL

```
VITE_SUPABASE_ANON_KEY
```
**Description**: Supabase anonymous/public API key  
**Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  
**Where to get it**: Supabase Dashboard → Settings → API → Project API keys → anon/public

---

### Email Service (Resend)

```
RESEND_API_KEY
```
**Description**: API key for Resend email service  
**Example**: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`  
**Where to get it**: https://resend.com → API Keys

```
RESEND_FROM_EMAIL
```
**Description**: Email address to send emails from  
**For Production**: `noreply@erayawellnesstravels.com` (after domain verification)  
**For Testing**: `onboarding@resend.dev`

```
ADMIN_EMAIL
```
**Description**: Email address to receive contact form submissions  
**Example**: `erayawellnesstravels@gmail.com`

---

### Payment Gateway (Stripe)

```
STRIPE_SECRET_KEY
```
**Description**: Stripe secret key  
**For Testing**: Use your test mode secret key (starts with `sk_test_`)  
**For Production**: Use your live mode secret key (starts with `sk_live_`)  
**Where to get it**: https://dashboard.stripe.com/apikeys

```
STRIPE_PUBLISHABLE_KEY
```
**Description**: Stripe publishable key  
**For Testing**: Use your test mode publishable key (starts with `pk_test_`)  
**For Production**: Use your live mode publishable key (starts with `pk_live_`)  
**Where to get it**: https://dashboard.stripe.com/apikeys

```
STRIPE_WEBHOOK_SECRET
```
**Description**: Stripe webhook signing secret  
**Example**: Starts with `whsec_` followed by your webhook secret  
**Where to get it**: 
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://erayawellnesstravels.com/api/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret

---

### AI Service (Google Gemini)

```
GEMINI_API_KEY
```
**Description**: Google Gemini API key for AI chatbot  
**Example**: `AIzaSy...`  
**Where to get it**: https://makersuite.google.com/app/apikey

```
GEMINI_MODEL
```
**Description**: Gemini model to use  
**Value**: `gemini-1.5-flash`

---

### Application Configuration

```
FRONTEND_URL
```
**Description**: Your application's public URL  
**For Production**: `https://erayawellnesstravels.com`  
**For Preview**: `https://your-preview-url.vercel.app`

```
NODE_ENV
```
**Description**: Node environment  
**Value**: `production`

```
ALLOWED_ORIGINS
```
**Description**: Comma-separated list of allowed CORS origins  
**For Production**: `https://erayawellnesstravels.com,https://www.erayawellnesstravels.com`

```
PING_MESSAGE
```
**Description**: Test message for health check endpoint  
**Value**: `ping pong`

---

## Important Notes

### Domain-Specific Configuration

After deploying and configuring your custom domain `erayawellnesstravels.com`:

1. **Update `FRONTEND_URL`** to `https://erayawellnesstravels.com`
2. **Update `ALLOWED_ORIGINS`** to include your domain
3. **Update Stripe webhook endpoint** to use your domain
4. **Update Google OAuth** redirect URIs in Supabase
5. **Verify Resend domain** and update `RESEND_FROM_EMAIL`

### Environment-Specific Values

For **Preview** deployments, you can use:
- Test Stripe keys (`sk_test_...`)
- `FRONTEND_URL` pointing to the preview URL
- Same database or a separate staging database

### Security Best Practices

- ✅ Never commit `.env` files to Git
- ✅ Use different keys for testing and production
- ✅ Rotate secrets periodically
- ✅ Use strong, random JWT secrets
- ✅ Keep Stripe webhook secrets secure

---

## Quick Copy Template

Here's a template with all variable names. Fill in the values from your services:

```env
# Database
DATABASE_URL=

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=7d

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# AI
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# App Config
FRONTEND_URL=https://erayawellnesstravels.com
NODE_ENV=production
ALLOWED_ORIGINS=https://erayawellnesstravels.com,https://www.erayawellnesstravels.com
PING_MESSAGE=ping pong
```

---

## Testing Environment Variables

After adding all variables in Vercel, you can test them:

1. Deploy your application
2. Check Vercel's deployment logs for any missing variable errors
3. Test the `/api/ping` endpoint
4. Verify database connectivity
5. Test authentication flow
6. Complete a test booking with Stripe

If any service fails, check that the corresponding environment variables are correctly set in Vercel.
