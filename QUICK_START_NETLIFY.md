# 🚀 Quick Netlify Deployment Guide

## TL;DR - Deploy in 30 Minutes

1. **Push to GitHub** (1 min)
2. **Connect to Netlify** (5 min)
3. **Add Environment Variables** (10 min)
4. **Deploy** (5 min)
5. **Post-Deploy Config** (10 min)

---

## Step 1: GitHub (1 minute)

```bash
git add .
git commit -m "Configure Netlify deployment"
git push origin main
```

## Step 2: Netlify Setup (5 minutes)

1. Go to [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import existing project**
3. Choose **GitHub** → Select your repo
4. Build settings (auto-detected):
   - Build command: `pnpm run build:client`
   - Publish directory: `dist/spa`
5. **DON'T deploy yet** - add env vars first!

## Step 3: Environment Variables (10 minutes)

Go to **Site settings → Environment variables**

Copy from your `.env` file:

```env
DATABASE_URL=postgresql://...                          # From Supabase
NODE_ENV=production
FRONTEND_URL=https://[your-site].netlify.app          # Get after creating site
JWT_SECRET=[generate-new-64-char-string]              # Security!
JWT_EXPIRES_IN=7d
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=your-admin@email.com
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
ALLOWED_ORIGINS=https://[your-site].netlify.app
```

> **Generate JWT Secret:** `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

## Step 4: Deploy! (5 minutes)

1. Click **Deploys** tab
2. Click **Trigger deploy**
3. Wait 2-3 minutes for build
4. Get your Netlify URL: `https://[your-site].netlify.app`

## Step 5: Post-Deploy Config (10 minutes)

### 5.1 Supabase OAuth (3 min)
- Dashboard → **Auth → URL Configuration**
- Site URL: `https://[your-site].netlify.app`
- Redirect URLs: `https://[your-site].netlify.app/**`

### 5.2 Google OAuth (2 min)
- Google Cloud Console → **Credentials**
- Add redirect: `https://[your-project].supabase.co/auth/v1/callback`

### 5.3 Stripe Webhook (5 min)
- Stripe Dashboard → **Developers → Webhooks**
- Add endpoint: `https://[your-site].netlify.app/api/stripe-webhook`
- Event: `checkout.session.completed`
- Copy webhook secret → Update in Netlify env vars
- **Redeploy** after updating

---

## ✅ Verification (2 minutes)

Test these URLs:

1. **API**: `https://[your-site].netlify.app/api/ping`
   - Should return: `{"message":"ping pong"}`

2. **Frontend**: `https://[your-site].netlify.app`
   - Homepage should load

3. **Database**: Visit Tours/Treks pages
   - Should show data

4. **Auth**: Try Google login
   - Should work

5. **Payment**: Create test booking
   - Should redirect to Stripe

---

## 🆘 Common Issues

**Build fails?**
- Clear cache: Deploys → Clear cache and retry

**API 404?**
- Check `netlify.toml` redirects are deployed

**Database connection fails?**
- Verify `DATABASE_URL` in env vars

**OAuth doesn't work?**
- Update redirect URLs in Supabase + Google Console

**Webhook fails?**
- Update `STRIPE_WEBHOOK_SECRET` and redeploy

---

## 📚 Full Documentation

- **Complete Guide**: [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md)
- **Env Vars Checklist**: [NETLIFY_ENV_VARS.md](./NETLIFY_ENV_VARS.md)

---

## 🎉 Done!

Your website is now live with:
✅ Database (Supabase)
✅ Authentication (Google OAuth)
✅ Payments (Stripe)
✅ Email (Resend)
✅ AI Chatbot (Gemini)
✅ Admin Panel

**Live URL**: `https://[your-site].netlify.app`

Want a custom domain? See deployment guide Step 10.
