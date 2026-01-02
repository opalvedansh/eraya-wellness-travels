# Complete Netlify Deployment Guide

This guide will walk you through deploying your Eraya Wellness Travels website to Netlify with all features working: database, authentication, payments, and more.

## Prerequisites

- ✅ Netlify account ([Sign up free](https://app.netlify.com/signup))
- ✅ GitHub repository with your code
- ✅ Supabase project (already configured)
- ✅ Google OAuth credentials
- ✅ Stripe account
- ✅ Resend API key
- ✅ Gemini API key

## Part 1: Deploy to Netlify

### Step 1: Connect Your Repository

1. **Log in to Netlify**: Go to [app.netlify.com](https://app.netlify.com)
2. **Click "Add new site"** → "Import an existing project"
3. **Connect to Git provider**: Choose GitHub
4. **Authorize Netlify**: Grant access to your repositories
5. **Select your repository**: Choose `eraya-wellness-travels` (or your repo name)

### Step 2: Configure Build Settings

Netlify should auto-detect your settings from `netlify.toml`, but verify:

- **Base directory**: Leave empty (root)
- **Build command**: `pnpm run build:client`
- **Publish directory**: `dist/spa`
- **Functions directory**: `netlify/functions`

Click **"Deploy site"** (don't worry, it will fail initially - we need to add environment variables first).

### Step 3: Stop the Failing Build

1. Go to **"Site configuration"** → **"Build & deploy"**
2. Click **"Stop auto publishing"** (temporary)
3. This prevents failed builds while we configure

## Part 2: Configure Environment Variables

### Step 4: Add All Environment Variables

Go to **"Site configuration"** → **"Environment variables"** and add these:

#### Database & Backend
```
DATABASE_URL=postgresql://your-user:your-password@db.xxx.supabase.co:5432/postgres
NODE_ENV=production
FRONTEND_URL=https://your-site-name.netlify.app
```

> [!TIP]
> Get `DATABASE_URL` from your Supabase project → Settings → Database → Connection string (URI)

#### JWT Authentication
```
JWT_SECRET=your_secure_random_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d
```

> [!TIP]
> Generate a secure JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

#### Supabase (for Google OAuth)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> [!NOTE]
> Get these from Supabase Dashboard → Settings → API

#### Email Service (Resend)
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=your-admin@email.com
```

> [!WARNING]
> For production, you must verify your domain in Resend. Don't use `onboarding@resend.dev` in production.

#### Stripe Payments
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

> [!IMPORTANT]
> Use **live keys** for production, not test keys. Get webhook secret after creating webhook endpoint (Step 7).

#### Google Gemini AI
```
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

#### CORS Configuration
```
ALLOWED_ORIGINS=https://your-site-name.netlify.app
```

> [!NOTE]
> Replace `your-site-name.netlify.app` with your actual Netlify domain (found in Site settings)

### Step 5: Enable Auto Publishing

1. Go to **"Site configuration"** → **"Build & deploy"**
2. Click **"Activate builds"**
3. Click **"Trigger deploy"** → **"Deploy site"**

## Part 3: Post-Deployment Configuration

### Step 6: Update Google OAuth Redirect URLs

After your site deploys, update OAuth settings:

1. **Go to Supabase Dashboard** → Authentication → URL Configuration
2. **Add Site URL**: `https://your-site-name.netlify.app`
3. **Add Redirect URLs**:
   - `https://your-site-name.netlify.app/**`
   - `https://your-site-name.netlify.app/auth/callback`

4. **Go to Google Cloud Console** → APIs & Services → Credentials
5. **Edit OAuth 2.0 Client**
6. **Add Authorized redirect URIs**:
   - `https://your-project.supabase.co/auth/v1/callback`

### Step 7: Configure Stripe Webhook

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL**: `https://your-site-name.netlify.app/api/stripe-webhook`
4. **Select events to listen to**:
   - `checkout.session.completed`
5. **Add endpoint**
6. **Copy the Webhook Signing Secret** (`whsec_...`)
7. **Update Netlify Environment Variable**:
   - Go back to Netlify → Environment variables
   - Update `STRIPE_WEBHOOK_SECRET` with the new value
   - Redeploy the site

### Step 8: Update Email Settings in Supabase

1. **Go to Supabase Dashboard** → Settings → Auth → Email Templates
2. Configure templates to use your domain:
   - Change `{{ .SiteURL }}` to `https://your-site-name.netlify.app`

3. **Configure SMTP** (optional, for custom emails):
   - Settings → Auth → SMTP Settings
   - Enable Custom SMTP
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: `<your RESEND_API_KEY>`
   - Sender email: `noreply@yourdomain.com`

## Part 4: Verification & Testing

### Step 9: Test Your Deployment

Visit your Netlify site and test these features:

#### ✅ Frontend
- [ ] Homepage loads correctly
- [ ] All pages accessible (Tours, Treks, About, Contact)
- [ ] Responsive design works
- [ ] Images and assets load

#### ✅ API Endpoints
- [ ] Test API: Visit `https://your-site.netlify.app/api/ping`
- [ ] Should return: `{"message":"ping pong"}`

#### ✅ Database Connection
- [ ] Tours page shows tours from database
- [ ] Treks page shows treks from database

#### ✅ Authentication
- [ ] Google OAuth login works
- [ ] User session persists
- [ ] Protected routes require login

#### ✅ Chatbot
- [ ] AI chatbot responds
- [ ] Gemini API working

#### ✅ Contact Form
- [ ] Form submission works
- [ ] Email received at admin email

#### ✅ Booking & Payment
- [ ] Create a test booking
- [ ] Stripe checkout loads
- [ ] Payment completes (use test card in test mode first)
- [ ] Webhook updates booking status

#### ✅ Admin Panel
- [ ] Access `/admin` (must be logged in as admin user)
- [ ] Can manage tours/treks
- [ ] Dashboard shows statistics

## Part 5: Custom Domain (Optional)

### Step 10: Add Your Custom Domain

1. **Go to Netlify** → Site settings → Domain management
2. **Click "Add custom domain"**
3. **Enter your domain**: `erayawellness.com`
4. **Follow DNS configuration instructions**:
   - Update your domain registrar's DNS settings
   - Add A record or CNAME as instructed
5. **Enable HTTPS**: Netlify auto-provisions SSL (free)

6. **Update Environment Variables**:
   - Update `FRONTEND_URL` to `https://yourdomain.com`
   - Update `ALLOWED_ORIGINS` to include your domain
   - Redeploy

7. **Update OAuth Configurations**:
   - Update Supabase Site URL
   - Update Google OAuth redirect URIs
   - Update Stripe webhook URL

## Troubleshooting

### Build Fails

**Problem**: Build fails with module errors
- **Solution**: Check that all dependencies are in `package.json`
- **Solution**: Ensure `NODE_VERSION = "20"` in `netlify.toml`
- **Solution**: Clear cache and retry: Deploy settings → Clear cache and deploy

**Problem**: Prisma client errors
- **Solution**: Ensure `DATABASE_URL` is set correctly
- **Solution**: Add `prisma/schema.prisma` to included files in `netlify.toml`

### Functions Not Working

**Problem**: API calls return 404
- **Solution**: Check `netlify.toml` redirects are configured
- **Solution**: Verify function deployed: Functions tab in Netlify dashboard
- **Solution**: Check function logs for errors

**Problem**: Function timeout
- **Solution**: Free tier has 10s limit, Pro has 26s
- **Solution**: Optimize database queries
- **Solution**: Consider upgrading Netlify plan

### Database Connection Issues

**Problem**: "connect ETIMEDOUT" or connection refused
- **Solution**: Check `DATABASE_URL` is correct
- **Solution**: Verify Supabase database is accessible (not paused)
- **Solution**: Check if IP allowlist is enabled in Supabase (should be disabled or allow all)

### OAuth Not Working

**Problem**: Google login fails or redirects incorrectly
- **Solution**: Verify all redirect URLs are updated in Supabase and Google Console
- **Solution**: Ensure `FRONTEND_URL` matches your Netlify domain exactly
- **Solution**: Check browser console for CORS errors

### Stripe Webhook Fails

**Problem**: Payments succeed but booking status not updated
- **Solution**: Check Stripe webhook endpoint URL is correct
- **Solution**: Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- **Solution**: Check Netlify function logs for webhook errors
- **Solution**: Test webhook using Stripe CLI:
  ```bash
  stripe listen --forward-to https://your-site.netlify.app/api/stripe-webhook
  ```

### Email Not Sending

**Problem**: Verification emails or contact form emails not received
- **Solution**: Verify `RESEND_API_KEY` is valid
- **Solution**: Check domain is verified in Resend
- **Solution**: Check Resend dashboard logs
- **Solution**: Verify `RESEND_FROM_EMAIL` uses verified domain

### File Uploads

**Problem**: Uploaded images disappear after deployment
- **Solution**: This is expected - Netlify has read-only filesystem
- **Solution**: Migrate to Supabase Storage or Cloudinary (recommended)
- **Temporary workaround**: Re-upload images through admin panel after each deploy

## Performance Optimization

### Enable Netlify Features

1. **Asset Optimization**:
   - Site settings → Build & deploy → Post processing
   - Enable "Bundle CSS" and "Minify JS"

2. **Netlify Edge**:
   - Automatically enabled - uses CDN for faster delivery

3. **Prerendering** (optional):
   - For better SEO, consider Netlify's prerendering feature

### Monitor Performance

1. **Netlify Analytics** (paid):
   - Real user monitoring
   - Core Web Vitals tracking

2. **Function Logs**:
   - Monitor function execution times
   - Optimize slow endpoints

## Next Steps

✅ **Deployment complete!** Your website is now live on Netlify.

### Recommended Actions:

1. **Set up monitoring**:
   - Add uptime monitoring (UptimeRobot, Pingdom)
   - Set up error tracking (Sentry)

2. **Implement cloud storage**:
   - Migrate file uploads to Supabase Storage
   - This ensures images persist across deployments

3. **Configure backups**:
   - Supabase has automatic backups
   - Download database backups regularly

4. **Set up CI/CD**:
   - Already configured via Netlify + GitHub
   - Every push to main branch auto-deploys

5. **Performance testing**:
   - Run Lighthouse audits
   - Check load times from different regions

6. **Security review**:
   - Enable Netlify's Security headers
   - Set up Content Security Policy
   - Regular dependency updates

## Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: support@netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs

---

**Congratulations! Your website is live! 🎉**

If you encounter any issues, check the troubleshooting section or review the Netlify function logs for detailed error messages.
