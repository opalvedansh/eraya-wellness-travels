# Railway Environment Variables Template

Copy and paste these into Railway's Raw Editor, then replace the placeholder values with your actual credentials.

## Instructions
1. Go to your Railway project
2. Click on your service (not the database)
3. Navigate to **Variables** tab
4. Click **Raw Editor**
5. Paste the template below
6. Replace all `your-*` values with actual credentials
7. Click **Update Variables**

---

```bash
# Node Environment
NODE_ENV=production

# Port (Railway provides this automatically)
PORT=8080

# Database (Supabase PostgreSQL)
# Get this from: Supabase Dashboard → Project Settings → Database → Connection string (URI)
# Use the "Transaction pooler" connection string for serverless
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# JWT Authentication
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES_IN=7d

# Frontend/CORS Configuration
# IMPORTANT: Update these with your actual Vercel URL after deployment
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

# Supabase Configuration (for Google OAuth)
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=erayawellnesstravels@gmail.com

# Admin Configuration
ADMIN_EMAIL=erayawellnesstravels@gmail.com

# Payment (Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# AI Chat (Optional)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

# Ping Message (Optional)
PING_MESSAGE=ping pong
```

---

## Notes

- **DATABASE_URL**: Get from Supabase Dashboard → Project Settings → Database → Connection string (URI). Use the **Transaction pooler** string.
- **JWT_SECRET**: Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- **FRONTEND_URL & ALLOWED_ORIGINS**: Update after you have your Vercel deployment URL
- **Multiple Origins**: Use comma-separated values like: `https://domain1.com,https://domain2.com`
- **Stripe Webhook**: You'll need to update this after Railway deployment with the new endpoint

## Where to Find Your Credentials

| Variable | Where to Find |
|----------|---------------|
| `JWT_SECRET` | Generate a random string (see command above) |
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → Project API keys (anon/public) |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → Secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys → Publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → [Your webhook] → Signing secret |
| `GEMINI_API_KEY` | Google AI Studio → Get API Key |
