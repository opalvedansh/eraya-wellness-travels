# 🚀 Deployment Checklist - Railway Backend + Frontend

This is a **comprehensive checklist** for deploying your travel booking website. Follow every step carefully to ensure a smooth deployment.

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### ✅ **1. Code Quality & Security**

#### A. Remove Sensitive Data
- [ ] **CRITICAL**: Remove all hardcoded API keys, secrets, and passwords from code
- [ ] Verify `.env` is in `.gitignore` (already done, but double-check)
- [ ] Check for any `console.log()` statements with sensitive data
- [ ] Remove any test/demo credentials from the codebase

#### B. Code Review
- [ ] Review all TODO comments and resolve critical ones
- [ ] Ensure all TypeScript errors are resolved: `npm run typecheck`
- [ ] Test the build locally: `npm run build`
- [ ] Verify the production build starts correctly: `npm run start`

#### C. Security Headers & CORS
- [ ] Update CORS allowed origins in production `.env` to your actual domain
- [ ] Verify `trust proxy` is enabled (already in `server/index.ts` line 49)
- [ ] Ensure rate limiting is properly configured (already done)

---

### ✅ **2. Database Preparation**

#### A. Database Provider (Choose One)

**Option 1: Railway PostgreSQL** (Recommended - easiest)
- [ ] Create a new PostgreSQL database in Railway
- [ ] Copy the `DATABASE_URL` connection string
- [ ] Add connection pooling parameter: `?pgbouncer=true&connection_limit=10`

**Option 2: Supabase Database**
- [ ] Go to Supabase Dashboard → Settings → Database
- [ ] Copy the Connection Pooling URL (not Direct Connection)
- [ ] Use Transaction Mode for better performance

**Option 3: External PostgreSQL** (AWS RDS, DigitalOcean, etc.)
- [ ] Ensure database is accessible from Railway (check firewall rules)
- [ ] Use SSL connection in production
- [ ] Set up connection pooling

#### B. Database Schema
- [ ] Review `prisma/schema.prisma` for any pending changes
- [ ] Generate Prisma Client locally: `npx prisma generate`
- [ ] **IMPORTANT**: After deployment, run migrations:
  ```bash
  npx prisma migrate deploy
  ```

#### C. Database Security
- [ ] Use strong database passwords (minimum 20 characters)
- [ ] Enable SSL/TLS for database connections
- [ ] Restrict database access to your application only (IP whitelist if possible)
- [ ] Set up automated backups (Railway does this automatically for paid plans)

---

### ✅ **3. Third-Party Service Configuration**

#### A. Stripe Payment Gateway

**Development Setup (Already Done)**
- [x] Test keys configured
- [x] Webhook endpoint tested with Stripe CLI

**Production Setup**
- [ ] Get **Live API Keys** from Stripe Dashboard
  - Go to: https://dashboard.stripe.com/apikeys
  - Switch to **"Live mode"** (toggle in top right)
  - Copy `pk_live_...` (Publishable Key)
  - Copy `sk_live_...` (Secret Key)

- [ ] **CRITICAL**: Create Production Webhook
  1. Go to: https://dashboard.stripe.com/webhooks (Live mode)
  2. Click "Add endpoint"
  3. Endpoint URL: `https://your-domain.com/api/stripe-webhook`
  4. Select event: `checkout.session.completed`
  5. Copy the **Webhook Signing Secret** (`whsec_...`)

- [ ] Test payment flow in Stripe Test Mode before going live
- [ ] Review Stripe account settings (business info, bank details)
- [ ] Enable Stripe Radar (fraud prevention) if available

#### B. Supabase Authentication

- [ ] Verify Supabase project settings:
  - Go to: Settings → API
  - Copy Project URL (`VITE_SUPABASE_URL`)
  - Copy Anon/Public Key (`VITE_SUPABASE_ANON_KEY`)

- [ ] **Configure Production Site URL**:
  1. Go to: Authentication → URL Configuration
  2. Set Site URL: `https://your-domain.com`
  3. Add Redirect URLs:
     - `https://your-domain.com/**`
     - `https://www.your-domain.com/**`

- [ ] **Configure Google OAuth**:
  1. Go to: Authentication → Providers → Google
  2. Update Authorized Redirect URI to production domain
  3. Test OAuth flow after deployment

- [ ] **Email Configuration** (Critical for magic links):
  1. Go to: Settings → Auth → SMTP Settings
  2. Enable Custom SMTP
  3. Use Resend credentials (see below)

#### C. Resend Email Service

- [ ] **Verify Your Domain**:
  1. Go to: https://resend.com/domains
  2. Add your domain (e.g., `erayawellnesstravels.com`)
  3. Add DNS records (SPF, DKIM, DMARC) to your domain provider
  4. Wait for verification (can take up to 48 hours)

- [ ] **Update Email Sender**:
  - Change from `onboarding@resend.dev` to `noreply@your-domain.com`
  - Update in both application and Supabase SMTP settings

- [ ] **Test Email Delivery**:
  - Send test emails after domain verification
  - Check spam folder placement
  - Verify email formatting on mobile and desktop

#### D. Google Gemini AI (Chatbot)

- [ ] Verify API key is working
- [ ] Check API quotas and rate limits
- [ ] Consider upgrading to paid plan if needed
- [ ] Monitor usage after deployment

---

### ✅ **4. Environment Variables Setup**

Create a **production environment variables** file. Here's what you need:

#### **Railway Environment Variables** (Backend)

```bash
# =====================================================
# DATABASE
# =====================================================
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=10

# =====================================================
# APPLICATION
# =====================================================
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
PING_MESSAGE=pong

# =====================================================
# JWT AUTHENTICATION
# =====================================================
JWT_SECRET=<generate-secure-64-char-random-string>
JWT_EXPIRES_IN=7d

# =====================================================
# STRIPE (LIVE KEYS)
# =====================================================
STRIPE_SECRET_KEY=<your-stripe-live-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-live-publishable-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# =====================================================
# SUPABASE
# =====================================================
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# =====================================================
# RESEND EMAIL (with VERIFIED domain)
# =====================================================
RESEND_API_KEY=<your-resend-api-key>
RESEND_FROM_EMAIL=noreply@your-verified-domain.com
ADMIN_EMAIL=your-admin-email@gmail.com

# =====================================================
# GOOGLE GEMINI AI
# =====================================================
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# =====================================================
# CORS
# =====================================================
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

#### **Important Security Notes**:

1. **Generate Secure JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Never Commit These Values**: Keep them only in Railway dashboard

3. **Use Different Values for Production**: Don't reuse development secrets

---

### ✅ **5. Build & Deployment Configuration**

#### A. Verify Build Scripts

Your `package.json` already has correct scripts:
- [x] `"build": "npm run build:client && npm run build:server"`
- [x] `"start": "node dist/server/node-build.mjs"`

#### B. Create Railway Configuration

Create `railway.json` in your project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm install && pnpm build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### C. Create `.dockerignore` (Already exists, verify it includes):

```
node_modules
.env
.env.local
.git
.gitignore
*.md
.vscode
.idea
logs
*.log
dist
.DS_Store
```

---

### ✅ **6. Frontend Preparation**

#### A. Update API Endpoints

- [ ] Verify all API calls use relative paths (e.g., `/api/...`)  
      OR environment variable for API base URL
- [ ] Check that `FRONTEND_URL` is used for redirects

#### B. Build Verification

- [ ] Test production build locally:
  ```bash
  npm run build
  npm run start
  ```
- [ ] Visit `http://localhost:8080` and test all features
- [ ] Check browser console for errors
- [ ] Test on mobile viewport

#### C. SEO & Meta Tags

- [ ] Update `index.html` with production meta tags:
  - Title
  - Description
  - OG image
  - Favicon
  - Canonical URL

- [ ] Add `robots.txt` to `public/` folder
- [ ] Add `sitemap.xml` if needed

---

### ✅ **7. Domain & DNS Configuration**

Since your client already bought the domain, you need to configure it:

#### A. Add Custom Domain to Railway

1. [ ] Go to Railway project → Settings → Networking
2. [ ] Click "Add Custom Domain"
3. [ ] Enter your domain (e.g., `erayawellnesstravels.com`)
4. [ ] Railway will provide DNS records

#### B. Configure DNS (at Domain Registrar)

Add these records (exact values will be provided by Railway):

```
Type    Name    Value                           TTL
A       @       <Railway-IP-Address>            3600
CNAME   www     <your-app>.up.railway.app       3600
```

#### C. SSL Certificate

- [ ] Railway automatically provisions SSL via Let's Encrypt
- [ ] Wait 5-10 minutes after DNS propagation
- [ ] Verify HTTPS is working: `https://your-domain.com`

#### D. Redirect www to non-www (or vice versa)

- [ ] Add both domains in Railway
- [ ] Set primary domain
- [ ] Configure 301 redirects if needed

---

### ✅ **8. Testing Plan**

Create this systematic testing plan for after deployment:

#### A. Smoke Tests (Critical Paths)

- [ ] **Homepage loads** without errors
- [ ] **Navigation** works (all menu links)
- [ ] **Search functionality** works
- [ ] **Tour/Trek pages** load correctly with images

#### B. Authentication Flow

- [ ] **Google OAuth login** works
- [ ] **Email verification** emails are sent and received
- [ ] **Magic link** authentication works
- [ ] **Session persistence** after page refresh
- [ ] **Logout** functionality works

#### C. Booking & Payment Flow

This is **CRITICAL** - test thoroughly:

1. [ ] Select a tour/trek
2. [ ] Click "Book Now"
3. [ ] Fill booking form
4. [ ] Verify authentication redirect (if not logged in)
5. [ ] Proceed to payment
6. [ ] Complete **test payment** in Stripe (use test card: `4242 4242 4242 4242`)
7. [ ] Verify redirect to success page
8. [ ] Check email confirmation sent
9. [ ] Verify booking appears in user profile
10. [ ] Check database records created
11. [ ] Verify webhook received in Stripe dashboard

#### D. Email Functionality

- [ ] Contact form emails received
- [ ] Booking confirmation emails sent
- [ ] Password reset emails (if applicable)
- [ ] Custom trip inquiry emails

#### E. Performance Tests

- [ ] Page load speed (use Google PageSpeed Insights)
- [ ] Mobile responsiveness
- [ ] Image optimization
- [ ] API response times

#### F. Security Tests

- [ ] Try accessing protected routes without auth
- [ ] Test rate limiting (try making 20 rapid requests)
- [ ] Verify HTTPS is enforced
- [ ] Check for mixed content warnings

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Prepare Railway Account**

1. [ ] Sign up/login to Railway: https://railway.app
2. [ ] Add payment method (required even for hobby plan)
3. [ ] Create new project

### **Step 2: Deploy Database First**

1. [ ] In Railway project, click "New" → "Database" → "PostgreSQL"
2. [ ] Wait for database to provision (~1 minute)
3. [ ] Click on database → "Connect" → Copy `DATABASE_URL`
4. [ ] **Important**: Add connection pooling parameter:
   ```
   ?pgbouncer=true&connection_limit=10
   ```

### **Step 3: Deploy Backend Application**

1. [ ] In Railway project, click "New" → "GitHub Repo"
2. [ ] Select your repository
3. [ ] Configure build:
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `npx prisma migrate deploy && pnpm start`
4. [ ] Add all environment variables (from section 4 above)
5. [ ] Click "Deploy"

### **Step 4: Run Database Migrations**

After first deployment:

1. [ ] Go to Railway → Your service → "Deployments"
2. [ ] Click on latest deployment
3. [ ] Open deployment logs
4. [ ] Verify migration ran successfully (look for "Prisma Migrate")
5. [ ] If migration failed, manually run:
   ```bash
   railway run npx prisma migrate deploy
   ```

### **Step 5: Configure Custom Domain**

1. [ ] Railway → Settings → Networking → "Custom Domain"
2. [ ] Add your domain
3. [ ] Copy provided DNS records
4. [ ] Add records to your domain registrar DNS settings
5. [ ] Wait for DNS propagation (5-60 minutes)
6. [ ] Verify domain works: `https://your-domain.com`

### **Step 6: Update Stripe Webhook**

1. [ ] Go to Stripe Dashboard → Webhooks
2. [ ] Add new endpoint: `https://your-domain.com/api/stripe-webhook`
3. [ ] Select event: `checkout.session.completed`
4. [ ] Copy webhook secret
5. [ ] Update `STRIPE_WEBHOOK_SECRET` in Railway environment variables
6. [ ] Redeploy application

### **Step 7: Update Supabase Configuration**

1. [ ] Supabase → Authentication → URL Configuration
2. [ ] Site URL: `https://your-domain.com`
3. [ ] Redirect URLs: Add production URLs
4. [ ] Test authentication flow

### **Step 8: Verify Email Sending**

1. [ ] Resend → Domains → Verify your domain is verified
2. [ ] Update `RESEND_FROM_EMAIL` to your verified domain email
3. [ ] Redeploy
4. [ ] Send test email via contact form

---

## ✅ **POST-DEPLOYMENT CHECKLIST**

### **Immediately After Deployment**

- [ ] Run through complete testing plan (Section 8)
- [ ] Test from different devices (mobile, tablet, desktop)
- [ ] Test from different browsers (Chrome, Safari, Firefox)
- [ ] Verify all emails are being sent and received
- [ ] Check Railway logs for any errors
- [ ] Monitor database connections

### **Within 24 Hours**

- [ ] Set up monitoring:
  - [ ] Railway metrics (CPU, memory, requests)
  - [ ] Database performance
  - [ ] Error tracking (Sentry recommended)

- [ ] Configure alerts:
  - [ ] Railway deployment failures
  - [ ] High error rates
  - [ ] Database connection issues

- [ ] Set up backups:
  - [ ] Database automated backups (Railway Pro plan)
  - [ ] Code repository backup

### **Within 1 Week**

- [ ] Monitor user activity
- [ ] Check for any error patterns
- [ ] Optimize slow queries
- [ ] Review security logs
- [ ] Collect initial user feedback

---

## 📊 **MONITORING & MAINTENANCE**

### **Daily Checks**

- [ ] Check Railway deployment status
- [ ] Review error logs
- [ ] Monitor payment processing (Stripe dashboard)
- [ ] Check email delivery rates (Resend)

### **Weekly Checks**

- [ ] Review application performance
- [ ] Check database size and growth
- [ ] Monitor API usage and costs
- [ ] Review user feedback

### **Monthly Tasks**

- [ ] Update dependencies: `npm outdated`
- [ ] Security audit: `npm audit`
- [ ] Review and rotate API keys if needed
- [ ] Database optimization
- [ ] Cost analysis (Railway, Stripe, Supabase, Resend)

---

## 🆘 **TROUBLESHOOTING**

### **Deployment Fails**

1. Check Railway build logs
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors: `npm run typecheck`

### **Database Connection Errors**

1. Verify `DATABASE_URL` is correct
2. Check database is running in Railway
3. Verify connection pooling is configured
4. Check for connection limit issues

### **Stripe Webhook Not Working**

1. Verify webhook endpoint URL is correct
2. Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Review webhook event logs in Stripe dashboard
4. Check Railway logs for webhook requests
5. Verify raw body parsing middleware is correct

### **Emails Not Sending**

1. Verify Resend domain is verified (check DNS records)
2. Check `RESEND_API_KEY` is correct
3. Verify `RESEND_FROM_EMAIL` matches verified domain
4. Check Resend dashboard for failed deliveries
5. Review server logs for email sending errors

### **Authentication Issues**

1. Verify Supabase URLs and keys are correct
2. Check Site URL in Supabase matches production domain
3. Verify redirect URLs are configured
4. Clear browser cache and cookies
5. Check Supabase Auth logs

---

## 📝 **FINAL PRE-LAUNCH CHECKLIST**

- [ ] All environment variables configured correctly
- [ ] Database migrations successful
- [ ] Custom domain working with HTTPS
- [ ] Stripe webhook receiving events
- [ ] Emails sending successfully
- [ ] All authentication methods working (Google OAuth, Magic Link)
- [ ] Complete booking flow tested end-to-end
- [ ] Payment processing tested with real Stripe test mode
- [ ] Error monitoring set up
- [ ] Backups configured
- [ ] All team members have access to necessary dashboards
- [ ] Client has been trained on admin features (if applicable)
- [ ] Documentation updated with production URLs
- [ ] README updated with deployment info

---

## 🎉 **GO LIVE!**

Once all checkboxes above are completed:

1. [ ] Switch Stripe from Test Mode to Live Mode
2. [ ] Update Stripe keys in Railway environment variables
3. [ ] Make final backup of database
4. [ ] Announce launch to client
5. [ ] Monitor closely for first 48 hours
6. [ ] Celebrate! 🎊

---

## 📞 **Emergency Contacts**

Keep these handy:

- **Railway Support**: https://railway.app/help
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support
- **Resend Support**: support@resend.com
- **Domain Registrar Support**: [Your registrar's contact]

---

## 💡 **Tips for Success**

1. **Test Everything Twice**: Better safe than sorry
2. **Deploy Early in the Day**: So you have time to fix issues
3. **Have a Rollback Plan**: Keep previous working version available
4. **Monitor Logs Actively**: First 24 hours are critical
5. **Communicate with Client**: Keep them updated on progress
6. **Document Everything**: Future you will thank present you

---

**Good luck with your deployment! 🚀**
