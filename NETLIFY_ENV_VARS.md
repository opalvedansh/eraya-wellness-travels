# Netlify Environment Variables Checklist

Copy this list when configuring environment variables in Netlify Dashboard.

Go to: **Site configuration** → **Environment variables** → **Add a variable**

## Required Variables

### Database & Backend
- [ ] `DATABASE_URL` - Get from Supabase → Settings → Database → Connection string (URI)
  - Example: `postgresql://user:pass@db.xxx.supabase.co:5432/postgres`
- [ ] `NODE_ENV` - Set to: `production`
- [ ] `FRONTEND_URL` - Your Netlify URL
  - Example: `https://your-site.netlify.app`

### JWT Authentication
- [ ] `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- [ ] `JWT_EXPIRES_IN` - Set to: `7d`

### Supabase
- [ ] `VITE_SUPABASE_URL` - Get from Supabase → Settings → API
  - Example: `https://xxxxx.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` - Get from Supabase → Settings → API
  - Starts with: `eyJhbGc...`

### Email Service (Resend)
- [ ] `RESEND_API_KEY` - Get from [resend.com/api-keys](https://resend.com/api-keys)
  - Starts with: `re_`
- [ ] `RESEND_FROM_EMAIL` - Your verified domain email
  - Example: `noreply@yourdomain.com`
- [ ] `ADMIN_EMAIL` - Email where contact forms are sent
  - Example: `admin@yourdomain.com`

### Stripe Payments
- [ ] `STRIPE_SECRET_KEY` - Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
  - Test: `sk_test_...`
  - Live: `sk_live_...`
- [ ] `STRIPE_PUBLISHABLE_KEY` - Get from Stripe Dashboard
  - Test: `pk_test_...`
  - Live: `pk_live_...`
- [ ] `STRIPE_WEBHOOK_SECRET` - Get after creating webhook endpoint
  - Starts with: `whsec_`
  - See deployment guide Step 7 for setup

### Google Gemini AI
- [ ] `GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] `GEMINI_MODEL` - Set to: `gemini-1.5-flash`

### CORS Configuration
- [ ] `ALLOWED_ORIGINS` - Your Netlify URL
  - Example: `https://your-site.netlify.app`

---

## Quick Copy-Paste Template

Use this template and fill in your values:

```env
# Database & Backend
DATABASE_URL=postgresql://user:pass@db.xxx.supabase.co:5432/postgres
NODE_ENV=production
FRONTEND_URL=https://your-site.netlify.app

# JWT
JWT_SECRET=your_64_character_random_string_here
JWT_EXPIRES_IN=7d

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Email
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# CORS
ALLOWED_ORIGINS=https://your-site.netlify.app
```

---

## Post-Deployment Configuration

After adding variables and deploying, update these third-party services:

### 1. Supabase OAuth Settings
- Dashboard → Authentication → URL Configuration
- Add Site URL: `https://your-site.netlify.app`
- Add Redirect URLs: `https://your-site.netlify.app/**`

### 2. Google Cloud Console
- APIs & Services → Credentials → Edit OAuth Client
- Add redirect: `https://your-project.supabase.co/auth/v1/callback`

### 3. Stripe Webhook
- Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://your-site.netlify.app/api/stripe-webhook`
- Event: `checkout.session.completed`
- Copy webhook secret and update Netlify env var

### 4. Resend Domain Verification
- Add and verify your domain
- Update DNS records as instructed
- Update `RESEND_FROM_EMAIL` to use verified domain

---

## Verification

Test these endpoints after deployment:

1. **API Health**: `https://your-site.netlify.app/api/ping`
   - Should return: `{"message":"ping pong"}`

2. **Database**: Visit tours/treks pages
   - Should load data from Supabase

3. **Auth**: Try Google login
   - Should redirect and authenticate

4. **Stripe**: Create test booking
   - Should redirect to Stripe checkout

See [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md) for complete testing checklist.
