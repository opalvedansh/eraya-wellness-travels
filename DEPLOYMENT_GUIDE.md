# 🚀 Deployment Guide - Eraya Wellness Travels
## Deploy to Railway with erayawellness.com

This guide will walk you through deploying your website step-by-step. Follow each section carefully.

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:

- [ ] Railway account (sign up at https://railway.app)
- [ ] Domain `erayawellness.com` purchased and DNS access
- [ ] Supabase project URL and keys
- [ ] Resend API key
- [ ] Google Gemini API key
- [ ] **IMPORTANT**: Stripe keys can be added later (payments are disabled by default)

---

## Part 1: Deploy to Railway (30 minutes)

### Step 1: Create Railway Project

1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account if not already connected
5. Select your repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Wait ~1 minute for the database to provision
3. Click on the PostgreSQL service
4. Go to **"Connect"** tab
5. Copy the **"DATABASE_URL"** (it starts with `postgresql://`)
6. Save it somewhere safe - you'll need it in the next step

### Step 3: Configure Environment Variables

1. Click on your **main service** (not the database)
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add each one below:

#### Copy and paste these variables:

```bash
# ===== DATABASE =====
DATABASE_URL=<paste-the-database-url-from-step-2>

# ===== APPLICATION =====
NODE_ENV=production
FRONTEND_URL=https://erayawellness.com
PING_MESSAGE=pong

# ===== JWT (Generate a secure secret) =====
JWT_SECRET=<run-command-below-to-generate>
JWT_EXPIRES_IN=7d

# ===== SUPABASE =====
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# ===== RESEND EMAIL =====
RESEND_API_KEY=<your-resend-api-key>
RESEND_FROM_EMAIL=noreply@erayawellness.com
ADMIN_EMAIL=<your-email@gmail.com>

# ===== GOOGLE GEMINI =====
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-1.5-flash

# ===== CORS =====
ALLOWED_ORIGINS=https://erayawellness.com,https://www.erayawellness.com

# ===== STRIPE (Leave empty for now - add when business is registered) =====
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

#### Generate JWT_SECRET:

Run this command in your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET`.

### Step 4: Deploy

1. Railway will automatically deploy after you add environment variables
2. Wait 3-5 minutes for the build to complete
3. Check the **"Deployments"** tab to see progress
4. Look for ✅ **"SUCCESS"** status

### Step 5: Check Deployment Logs

1. Click on the latest deployment
2. Scroll through logs and verify:
   - ✅ `Prisma migrate deploy` completed successfully
   - ✅ `Server initialized successfully`
   - ✅ No red error messages

If you see errors, check the **Troubleshooting** section at the bottom.

---

## Part 2: Connect Custom Domain (30-60 minutes)

### Step 1: Add Domain in Railway

1. In Railway, go to your service → **"Settings"** → **"Networking"**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `erayawellness.com`
5. Click **"Add Domain"**
6. Railway will show you DNS records to add

### Step 2: Configure DNS at Domain Registrar

**You'll see something like this in Railway:**

```
Add these records to your DNS provider:

Type    Name    Value                           
A       @       <Railway-IP-Address>           
CNAME   www     <your-app>.up.railway.app      
```

**Go to your domain registrar** (GoDaddy, Namecheap, etc.):

1. Find **"DNS Management"** or **"DNS Records"**
2. Add the **A record**:
   - Type: `A`
   - Name: `@` (or leave blank)
   - Value: `<IP from Railway>`
   - TTL: `3600` (or Auto)
3. Add the **CNAME record** for www:
   - Type: `CNAME`
   - Name: `www`
   - Value: `<your-app>.up.railway.app`
   - TTL: `3600` (or Auto)

### Step 3: Wait for DNS Propagation

- DNS changes can take **5-60 minutes** to propagate
- Railway will automatically provision an SSL certificate (HTTPS)
- You can check status at https://dnschecker.org/

### Step 4: Verify Domain Works

1. Visit https://erayawellness.com
2. Check for 🔒 HTTPS (SSL certificate)
3. Your website should load!

---

## Part 3: Configure Third-Party Services

### Supabase Configuration

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://erayawellness.com`
3. Add **Redirect URLs**:
   - `https://erayawellness.com/**`
   - `https://www.erayawellness.com/**`
4. Click **"Save"**

### Resend Email Domain Verification

1. Go to **Resend Dashboard** → **Domains**
2. Click **"Add Domain"**
3. Enter: `erayawellness.com`
4. Resend will show you DNS records to add (SPF, DKIM, DMARC)
5. Add these records to your domain registrar's DNS
6. Wait for verification (can take 24-48 hours)
7. Once verified ✅, update Railway env var:
   ```
   RESEND_FROM_EMAIL=noreply@erayawellness.com
   ```

---

## Part 4: Disable Payments (Until Business Registration)

### Step 1: Log in to Admin Panel

1. Go to https://erayawellness.com/admin
2. Log in with your admin account

### Step 2: Disable Payments

1. Click **"Settings"** in the sidebar
2. Find **"Payments Enabled"** toggle
3. Turn it **OFF** (should be gray/disabled)
4. Click **"Save Settings"**

✅ **Your website is now live with payments disabled!**

Customers can:
- Browse tours and treks
- Submit booking requests
- Receive message: "We'll contact you via email for payment"

---

## Part 5: Enable Payments (When Business is Registered)

### Prerequisites

- ✅ US business registration complete
- ✅ Stripe account in Live Mode
- ✅ Stripe live API keys obtained

### Step 1: Get Stripe Live Keys

1. Go to https://dashboard.stripe.com/apikeys
2. **Switch to "Live mode"** (toggle in top right)
3. Copy your keys:
   - **Publishable key**: starts with `pk_live_...`
   - **Secret key**: starts with `sk_live_...` (click "Reveal")

### Step 2: Create Production Webhook

1. Go to https://dashboard.stripe.com/webhooks (in Live mode)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://erayawellness.com/api/stripe-webhook`
4. Select events to listen to:
   - Click **"Select events"**
   - Search for and check: `checkout.session.completed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)

### Step 3: Update Railway Environment Variables

1. Go to Railway → Your service → **"Variables"**
2. Update these three variables:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```
3. Railway will automatically redeploy (wait 2-3 minutes)

### Step 4: Enable Payments in Admin

1. Go to https://erayawellness.com/admin/settings
2. Toggle **"Payments Enabled"** to **ON**
3. Click **"Save Settings"**

✅ **Payments are now live!**

### Step 5: Test Payment Flow

**Use Stripe test card** for testing:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

1. Browse to a trek (e.g., Everest Base Camp)
2. Click "Book Now"
3. Fill in booking form
4. Click "Continue to Secure Payment"
5. Complete payment on Stripe
6. Should redirect to success page
7. Check Stripe Dashboard for payment

---

## 🎉 You're Live!

Your website is now deployed and accessible at:
- https://erayawellness.com
- https://www.erayawellness.com

---

## 📊 Post-Deployment Monitoring

### Daily Checks (First Week)

- [ ] Check Railway deployment status
- [ ] Review error logs in Railway
- [ ] Monitor email delivery (Resend dashboard)
- [ ] Check booking submissions

### Weekly Checks

- [ ] Review Railway resource usage
- [ ] Check database size
- [ ] Monitor Supabase auth logs
- [ ] Review Google Gemini API usage

---

## 🆘 Troubleshooting

### Issue: Build Failed in Railway

**Solution:**
1. Check Railway deployment logs
2. Look for error message
3. Common causes:
   - Missing environment variable
   - TypeScript errors (run `npm run typecheck` locally)
   - Database connection issue

### Issue: Website Shows 500 Error

**Solution:**
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check database is running
4. Run `npx prisma migrate deploy` in Railway terminal

### Issue: Domain Not Working

**Solution:**
1. Check DNS records at domain registrar
2. Verify A record points to Railway IP
3. Wait 30+ minutes for DNS propagation
4. Check https://dnschecker.org/

### Issue: Emails Not Sending

**Solution:**
1. Verify Resend domain is verified ✅
2. Check `RESEND_FROM_EMAIL` matches verified domain
3. Check Resend dashboard for failed emails
4. Review Railway logs for email errors

### Issue: Supabase Login Not Working

**Solution:**
1. Check Supabase Site URL is `https://erayawellness.com`
2. Verify Redirect URLs include `https://erayawellness.com/**`
3. Clear browser cache and cookies
4. Check Supabase Auth logs

### Issue: Database Migration Failed

**Solution:**
1. Go to Railway → Your service → **"Terminal"**
2. Run: `npx prisma migrate deploy`
3. If still failing, check database is running
4. Verify `DATABASE_URL` is correct

---

## 🔐 Security Reminders

- ✅ Never commit `.env` or `.env.production` to Git
- ✅ Keep Railway environment variables secret
- ✅ Use strong passwords for admin accounts
- ✅ Regularly update dependencies: `npm outdated`
- ✅ Monitor Railway logs for suspicious activity

---

## 📞 Support Resources

- **Railway**: https://railway.app/help
- **Stripe**: https://support.stripe.com
- **Supabase**: https://supabase.com/support
- **Resend**: support@resend.com

---

## 🎊 Congratulations!

Your Eraya Wellness Travels website is now live and ready to help customers book amazing adventures in Nepal!

Next steps:
1. Share the website with your client
2. Train them on the admin panel
3. Monitor initial bookings
4. Gather customer feedback
5. When business is registered, enable Stripe payments

**Good luck! 🏔️✨**
