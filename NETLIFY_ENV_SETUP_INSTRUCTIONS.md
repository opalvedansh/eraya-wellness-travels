# Netlify Environment Variables - Ready to Use

## Instructions

On the Netlify deployment screen, you need to add these environment variables. Here's how:

### If You See "Show Advanced" or "Advanced Build Settings":
1. Click **"Show advanced"** or **"Advanced build settings"**
2. You'll see fields to add environment variables
3. For each variable below, click **"New variable"**
4. Enter the **Key** (name) and **Value**
5. After adding all, click **"Deploy site"**

### If You Don't See Advanced Settings:
1. Click **"Deploy site"** to create the site
2. Immediately go to **Site settings** → **Environment variables**
3. Add all variables there
4. Click **"Trigger deploy"** to redeploy

---

## Environment Variables to Add

Copy these from your local `.env` file and paste into Netlify:

### 1. Database & Backend

**Key**: `DATABASE_URL`  
**Value**: Get from your `.env` file - the full PostgreSQL connection string  
Example: `postgresql://user:password@db.xxxxx.supabase.co:5432/postgres`

**Key**: `NODE_ENV`  
**Value**: `production`

**Key**: `FRONTEND_URL`  
**Value**: Use this for now, update after deployment  
`https://your-site-name.netlify.app`  
*(You'll get the exact URL after deploying, then update this)*

---

### 2. JWT Authentication

**Key**: `JWT_SECRET`  
**Value**: Copy from your `.env` file  
*(Or generate a new one for production using the command below)*

**Key**: `JWT_EXPIRES_IN`  
**Value**: `7d`

**Generate new JWT secret** (recommended for production):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 3. Supabase

**Key**: `VITE_SUPABASE_URL`  
**Value**: Copy from your `.env` file  
Example: `https://xxxxx.supabase.co`

**Key**: `VITE_SUPABASE_ANON_KEY`  
**Value**: Copy from your `.env` file  
Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### 4. Email (Resend)

**Key**: `RESEND_API_KEY`  
**Value**: Copy from your `.env` file  
Starts with: `re_`

**Key**: `RESEND_FROM_EMAIL`  
**Value**: For now use the same as `.env`  
Later update to: `noreply@erayawellnesstravels.com` (after domain setup)

**Key**: `ADMIN_EMAIL`  
**Value**: Copy from your `.env` file  
Example: `vedanshlovesmom88@gmail.com` or `erayawellnesstravels@gmail.com`

---

### 5. Stripe

**Key**: `STRIPE_SECRET_KEY`  
**Value**: Copy from your `.env` file  
⚠️ **Important**: Use LIVE keys for production (starts with `sk_live_`)

**Key**: `STRIPE_PUBLISHABLE_KEY`  
**Value**: Copy from your `.env` file  
⚠️ **Important**: Use LIVE keys for production (starts with `pk_live_`)

**Key**: `STRIPE_WEBHOOK_SECRET`  
**Value**: Copy current value from `.env`  
⚠️ **Note**: You'll need to update this after creating webhook (see Step 7 in deployment guide)

---

### 6. AI (Gemini)

**Key**: `GEMINI_API_KEY`  
**Value**: Copy from your `.env` file

**Key**: `GEMINI_MODEL`  
**Value**: `gemini-1.5-flash`

---

### 7. CORS

**Key**: `ALLOWED_ORIGINS`  
**Value**: Use this for now, update after deployment  
`https://your-site-name.netlify.app`  
*(Update after you get your Netlify URL)*

---

## Quick Copy Template

Open your `.env` file and copy the values, then paste them one by one in Netlify:

```
DATABASE_URL=<from your .env>
NODE_ENV=production
FRONTEND_URL=https://your-site-name.netlify.app
JWT_SECRET=<from your .env>
JWT_EXPIRES_IN=7d
VITE_SUPABASE_URL=<from your .env>
VITE_SUPABASE_ANON_KEY=<from your .env>
RESEND_API_KEY=<from your .env>
RESEND_FROM_EMAIL=<from your .env>
ADMIN_EMAIL=<from your .env>
STRIPE_SECRET_KEY=<from your .env>
STRIPE_PUBLISHABLE_KEY=<from your .env>
STRIPE_WEBHOOK_SECRET=<from your .env>
GEMINI_API_KEY=<from your .env>
GEMINI_MODEL=gemini-1.5-flash
ALLOWED_ORIGINS=https://your-site-name.netlify.app
```

---

## Checklist

- [ ] DATABASE_URL
- [ ] NODE_ENV (set to `production`)
- [ ] FRONTEND_URL (temporary, will update)
- [ ] JWT_SECRET
- [ ] JWT_EXPIRES_IN (set to `7d`)
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] RESEND_API_KEY
- [ ] RESEND_FROM_EMAIL
- [ ] ADMIN_EMAIL
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] GEMINI_API_KEY
- [ ] GEMINI_MODEL (set to `gemini-1.5-flash`)
- [ ] ALLOWED_ORIGINS (temporary, will update)

---

## After Deployment - Update These

Once deployed, you'll get a URL like `https://eraya-wellness-travels.netlify.app`

### Update these environment variables:
1. `FRONTEND_URL` → `https://eraya-wellness-travels.netlify.app`
2. `ALLOWED_ORIGINS` → `https://eraya-wellness-travels.netlify.app`
3. Click **"Trigger deploy"** to apply changes

### After adding custom domain (erayawellnesstravels.com):
1. `FRONTEND_URL` → `https://erayawellnesstravels.com`
2. `ALLOWED_ORIGINS` → `https://erayawellnesstravels.com`
3. Update Stripe webhook secret (after creating new webhook)
4. Click **"Trigger deploy"** to apply changes

---

## Need Your Values?

To see your values (without sharing them here):

1. Open your `.env` file in VS Code
2. Copy each value one by one
3. Paste into Netlify

Or run this command to display (be careful, it shows secrets!):
```bash
cat .env
```

---

**Ready?** Add these variables in Netlify and deploy! 🚀
