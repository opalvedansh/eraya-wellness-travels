# Vercel Deployment Guide

Complete guide to deploy **Eraya Wellness & Travels** to Vercel with custom domain `erayawellnesstravels.com`.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Initial Setup](#initial-setup)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Environment Variables](#environment-variables)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Testing & Verification](#testing--verification)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub repository with your code pushed
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ Domain name `erayawellnesstravels.com` (access to DNS settings)
- ✅ All third-party service accounts set up:
  - Supabase (database)
  - Resend (email)
  - Stripe (payments)
  - Google Cloud Console (OAuth)
  - Google AI Studio (Gemini)

---

## Project Structure

Your project is organized as follows:

```
project-root/
├── api/                    # Vercel serverless functions
│   └── index.ts           # Main API handler
├── client/                # React frontend source
├── server/                # Express backend (wrapped for serverless)
├── dist/spa/              # Built frontend (after build)
├── public/                # Static assets
│   └── uploads/          # User-uploaded images
├── prisma/               # Database schema
├── vercel.json           # Vercel configuration
└── package.json          # Project dependencies
```

**How it works on Vercel:**
- Frontend is built to `dist/spa` and served as static files
- All `/api/*` requests are routed to the serverless function in `api/index.ts`
- The serverless function wraps your Express server
- Static uploads are served through the API function

---

## Initial Setup

### 1. Push Code to GitHub

If not already done:

```bash
# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/your-username/your-repo.git

# Push to GitHub
git push -u origin main
```

### 2. Verify Build Locally

Test that your project builds successfully:

```bash
# Install dependencies
pnpm install

# Build the frontend
pnpm run build

# Verify dist/spa directory is created
ls -la dist/spa
```

You should see `index.html` and an `assets` folder in `dist/spa`.

---

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Sign in with GitHub if not already logged in

2. **Import Git Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your repository from the list
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `eraya-wellness-travels` (or your preference)
   - **Framework Preset**: Other (no preset)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `pnpm install`

4. **Add Environment Variables**
   - Click "Environment Variables" section
   - Add all variables from [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)
   - Start with these critical ones:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - (Add all others from the guide)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (~2-5 minutes)
   - You'll get a URL like `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? eraya-wellness-travels
# - In which directory is your code? ./
# - Override settings? N
```

After deployment, add environment variables:

```bash
# Add environment variables via CLI
vercel env add DATABASE_URL production
# Paste your database URL when prompted
# Repeat for all environment variables
```

---

## Environment Variables

You **must** add all environment variables for your app to work. See [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md) for the complete list.

### Critical Variables

These are absolutely required:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `JWT_SECRET` | Authentication security |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public key |
| `STRIPE_SECRET_KEY` | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook security |
| `RESEND_API_KEY` | Email service |
| `GEMINI_API_KEY` | AI chatbot |

### Add Variables via Dashboard

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Click "Add New"
4. Enter variable name and value
5. Select environments: Production, Preview (both recommended)
6. Click "Save"
7. Repeat for all variables

**Important**: After adding/updating environment variables, you need to **redeploy** your application for changes to take effect.

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Click "Add Domain"
4. Enter: `erayawellnesstravels.com`
5. Click "Add"

Vercel will provide DNS configuration instructions.

### Step 2: Configure DNS (with your domain registrar)

You have two options:

#### Option A: Use Vercel Nameservers (Recommended)

Vercel will provide nameservers like:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS/Nameserver settings
3. Update nameservers to Vercel's nameservers
4. Save changes (may take 24-48 hours to propagate)

#### Option B: Use A/CNAME Records

Add these DNS records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### Step 3: Add www Subdomain (Optional but Recommended)

1. In Vercel → Domains, click "Add Domain"
2. Enter: `www.erayawellnesstravels.com`
3. Set to redirect to `erayawellnesstravels.com`

### Step 4: Wait for SSL Certificate

- Vercel automatically provisions SSL certificates
- This happens after DNS propagates
- Usually takes 5-60 minutes
- Your site will show "Invalid SSL" until complete

### Step 5: Update Environment Variables

After domain is configured, update these variables in Vercel:

```env
FRONTEND_URL=https://erayawellnesstravels.com
ALLOWED_ORIGINS=https://erayawellnesstravels.com,https://www.erayawellnesstravels.com
```

Then **redeploy** your application.

---

## Post-Deployment Configuration

After your site is live with the custom domain, update these external services:

### 1. Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://erayawellnesstravels.com/api/stripe-webhook`
4. Select event: `checkout.session.completed`
5. Copy the webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
7. Redeploy

### 2. Google OAuth Redirect URIs

Update Google Cloud Console with new redirect URIs:

1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your OAuth 2.0 Client ID
5. Under "Authorized redirect URIs", add:
   ```
   https://erayawellnesstravels.com/auth/callback
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
6. Save

### 3. Supabase Configuration

1. Go to Supabase Dashboard → Settings → Auth
2. Under "Site URL", set: `https://erayawellnesstravels.com`
3. Under "Redirect URLs", add:
   ```
   https://erayawellnesstravels.com/**
   https://erayawellnesstravels.com/auth/callback
   ```
4. Save

### 4. Resend Email Domain (Production)

For production emails from your domain:

1. Go to https://resend.com → Domains
2. Click "Add Domain"
3. Enter: `erayawellnesstravels.com`
4. Add DNS records provided by Resend to your domain
5. Wait for verification (usually 5-10 minutes)
6. Update `RESEND_FROM_EMAIL` to: `noreply@erayawellnesstravels.com`
7. Redeploy

---

## Testing & Verification

### 1. Basic Functionality

Test these endpoints and features:

**Health Check:**
```bash
curl https://erayawellnesstravels.com/api/ping
# Should return: {"message":"ping pong"}
```

**Homepage:**
- Visit https://erayawellnesstravels.com
- Should load without errors
- Check browser console for errors

**Tours & Treks:**
- Visit https://erayawellnesstravels.com/tours
- Verify tours load from database
- Visit https://erayawellnesstravels.com/treks
- Verify treks load from database

### 2. Authentication Flow

1. Click "Sign In" or "Sign Up"
2. Click "Continue with Google"
3. Complete Google OAuth flow
4. Should redirect back to homepage logged in
5. Verify user is created in Supabase database

### 3. Booking Flow

1. Select a tour/trek
2. Click "Book Now"
3. Fill in booking details
4. Click "Proceed to Payment"
5. Should redirect to Stripe checkout
6. Use test card: `4242 4242 4242 4242`
7. Complete payment
8. Should redirect back to success page
9. Verify booking is created in database

### 4. Admin Panel

1. Make your user an admin (see below)
2. Visit https://erayawellnesstravels.com/admin
3. Verify you can access admin dashboard
4. Test creating/editing tours and treks

**Make User Admin:**

You'll need to run a database query or use Prisma Studio:

```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'your-email@gmail.com';
```

Or use the script locally:
```bash
pnpm tsx scripts/make-admin.ts your-email@gmail.com
```

### 5. Contact & Email

1. Submit contact form
2. Check that email arrives at `ADMIN_EMAIL`
3. Verify email formatting and content

---

## Troubleshooting

### Build Fails

**Check build logs in Vercel:**
- Go to Deployments → Click failed deployment → View build logs
- Common issues:
  - Missing dependencies → Check `package.json`
  - TypeScript errors → Run `pnpm typecheck` locally
  - Build command fails → Verify `pnpm run build` works locally

**Solution:**
```bash
# Test locally
pnpm run build

# Fix any errors shown
# Push fix to GitHub
# Vercel will auto-deploy
```

### API Routes Return 404

**Issue**: API endpoints return 404 or don't work

**Solution:**
- Verify `vercel.json` exists in project root
- Check rewrites configuration includes `/api/*`
- Ensure `api/index.ts` file exists
- Redeploy after adding these files

### Database Connection Fails

**Issue**: "Cannot connect to database" errors

**Solution:**
- Verify `DATABASE_URL` is set in environment variables
- Check database URL format is correct
- Ensure database is accessible (not restricted by IP)
- Supabase: Check connection pooling settings
- Check Vercel function logs for specific error

### Environment Variables Not Working

**Issue**: App behaves as if env vars are missing

**Solution:**
- Environment variables require **redeployment** to take effect
- After adding/updating variables, redeploy:
  - Go to Deployments → Click "..." → "Redeploy"
  - Or push a new commit to trigger deployment
- Verify variables are set for "Production" environment
- For `VITE_*` variables: These must be set at build time

### Stripe Webhook Fails

**Issue**: Bookings created but payment doesn't complete

**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check webhook endpoint URL matches deployed domain
- View Stripe Dashboard → Webhooks → Event logs
- Ensure endpoint is set to `https://erayawellnesstravels.com/api/stripe-webhook`
- Test webhook: Stripe Dashboard → Send test webhook

### Images/Uploads Not Showing

**Issue**: Uploaded images return 404

**Solution:**
- Check files are in `public/uploads/` directory
- Verify upload routes are protected (admin only)
- Check `/uploads/*` rewrite in `vercel.json`
- Images uploaded locally won't persist on Vercel serverless
- **Recommended**: Use cloud storage (Cloudinary, S3, Supabase Storage)

### Domain Not Working

**Issue**: Custom domain shows "not found" or SSL error

**Solution:**
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct:
  ```bash
  dig erayawellnesstravels.com
  # Should show Vercel IP: 76.76.21.21
  ```
- Verify domain is added in Vercel → Settings → Domains
- Check SSL certificate status (auto-provisions after DNS)
- Try accessing via original Vercel URL first

### Function Timeout

**Issue**: API requests timeout after 10 seconds

**Solution:**
- Vercel free tier has 10s function timeout
- Upgrade to Pro for 60s timeout (serverless) or 15min (edge)
- Optimize slow database queries
- Add database indexes for frequently queried fields
- Use connection pooling for database

---

## Deployment Checklist

Before going live, verify:

- [ ] All environment variables added in Vercel
- [ ] Frontend builds successfully (`pnpm run build`)
- [ ] API endpoints respond (`/api/ping`)
- [ ] Database connection works
- [ ] Google OAuth flow works
- [ ] Stripe payment flow works
- [ ] Admin panel accessible
- [ ] Custom domain configured and SSL active
- [ ] Stripe webhook updated with production URL
- [ ] Google OAuth redirect URIs updated
- [ ] Supabase redirect URLs updated
- [ ] Resend domain verified (for production emails)
- [ ] Contact form sends emails
- [ ] Image uploads work (or cloud storage configured)

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. Make code changes locally
2. Commit changes: `git commit -m "Your changes"`
3. Push to GitHub: `git push`
4. Vercel automatically builds and deploys
5. Check deployment status in Vercel Dashboard

**Preview Deployments:**
- Every push to non-main branches creates a preview deployment
- Get a unique URL to test changes before merging
- Perfect for client reviews!

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Deployment Logs**: Check Vercel Dashboard → Deployments
- **Function Logs**: Vercel Dashboard → Logs (real-time)

---

## Next Steps

After successful deployment:

1. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor function execution times
   - Watch error rates

2. **Set Up Monitoring**
   - Enable Vercel Speed Insights
   - Set up error tracking (Sentry, etc.)
   - Monitor uptime

3. **Optimize**
   - Review bundle size
   - Optimize images
   - Enable caching strategies

4. **Scale**
   - Upgrade Vercel plan if needed
   - Consider dedicated database instance
   - Implement CDN for static assets

---

## Success! 🎉

Your website is now live at **https://erayawellnesstravels.com**

Happy deploying! If you encounter any issues, refer to the troubleshooting section or check Vercel's deployment logs.
