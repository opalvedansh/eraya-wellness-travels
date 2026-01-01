# 🚀 Deployment Guide - Eraya Wellness Travels

This guide covers deploying your application to Railway with PostgreSQL database.

## Prerequisites

- [ ] Railway account (sign up at https://railway.app)
- [ ] Domain name purchased
- [ ] Stripe live mode keys
- [ ] Supabase project configured
- [ ] Resend domain verified

## Quick Start Deployment

### 1. Database Setup (Railway PostgreSQL)

1. Create new project in Railway
2. Click **New** → **Database** → **PostgreSQL**
3. Wait for provisioning (~1 minute)
4. Copy `DATABASE_URL` from the database **Connect** tab

### 2. Deploy Application

1. In Railway project, click **New** → **GitHub Repo**
2. Select your repository: `eraya-wellness-travels`
3. Railway will auto-detect build configuration from `railway.json`

### 3. Environment Variables

Copy all variables from `.env.production.template` to Railway:

**Railway Dashboard** → **Your Service** → **Variables** tab

#### Critical Variables Checklist:

```bash
✓ DATABASE_URL (from step 1)
✓ JWT_SECRET (generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
✓ STRIPE_SECRET_KEY (live key: sk_live_...)
✓ STRIPE_PUBLISHABLE_KEY (live key: pk_live_...)
✓ STRIPE_WEBHOOK_SECRET (create webhook first - see below)
✓ VITE_SUPABASE_URL
✓ VITE_SUPABASE_ANON_KEY
✓ RESEND_API_KEY
✓ RESEND_FROM_EMAIL (must be from verified domain)
✓ GEMINI_API_KEY
✓ FRONTEND_URL=https://your-domain.com
✓ ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
✓ NODE_ENV=production
```

### 4. Database Migrations

After first deployment:

```bash
# Railway will run this automatically via railway.json:
npx prisma migrate deploy
```

Check deployment logs to verify migration succeeded.

### 5. Custom Domain Configuration

1. **Railway:** Settings → Networking → **Add Custom Domain**
2. Enter your domain (e.g., `erayawellnesstravels.com`)
3. Copy provided DNS records
4. **Domain Registrar:** Add DNS records:
   ```
   Type    Name    Value                           TTL
   A       @       <Railway-IP>                    3600
   CNAME   www     <your-app>.up.railway.app       3600
   ```
5. Wait for DNS propagation (5-60 minutes)
6. Railway auto-provisions SSL certificate

### 6. Stripe Webhook Configuration

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/stripe-webhook`
4. Select event: `checkout.session.completed`
5. Copy **Webhook Signing Secret** (`whsec_...`)
6. Add to Railway: `STRIPE_WEBHOOK_SECRET=whsec_...`
7. Redeploy application

### 7. Supabase Configuration

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Site URL: `https://your-domain.com`
3. Add Redirect URLs:
   - `https://your-domain.com/**`
   - `https://www.your-domain.com/**`
4. **Providers** → **Google** → Update OAuth redirect URI

### 8. Resend Email Domain

1. **Resend Dashboard** → **Domains**
2. Verify your domain is **Verified** (green checkmark)
3. If not, add DNS records (SPF, DKIM, DMARC) to your domain provider
4. Update `RESEND_FROM_EMAIL` to use your verified domain

## Post-Deployment Testing

### Critical Path Testing

- [ ] Homepage loads without errors
- [ ] Navigate to Treks page - map loads correctly
- [ ] Test trek booking flow
- [ ] Complete test payment (use Stripe test card: `4242 4242 4242 4242`)
- [ ] Verify email confirmation sent
- [ ] Test Google OAuth login
- [ ] Check booking appears in user profile
- [ ] Verify webhook received in Stripe Dashboard

### Performance Testing

```bash
# Run Google PageSpeed Insights
https://pagespeed.web.dev/

# Target scores:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
```

### Monitoring

- [ ] Check Railway deployment logs for errors
- [ ] Monitor Stripe Dashboard for successful payments
- [ ] Check Resend Dashboard for email delivery
- [ ] Review Supabase Auth logs

## Troubleshooting

### Build Fails

```bash
# Check Railway build logs
# Common issues:
- Missing environment variables
- TypeScript errors
- Dependency installation failures

# Local test:
npm run build
```

### Database Connection Errors

```bash
# Verify DATABASE_URL format:
postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=10

# Check database is running in Railway
```

### Emails Not Sending

```bash
# 1. Verify Resend domain is verified
# 2. Check RESEND_FROM_EMAIL matches verified domain
# 3. Review Resend dashboard for failures
# 4. Check server logs for email errors
```

### Stripe Webhook Not Working

```bash
# 1. Verify webhook URL is correct
# 2. Check STRIPE_WEBHOOK_SECRET matches dashboard
# 3. Review Stripe webhook event logs
# 4. Check Railway logs for webhook requests
```

## Going Live Checklist

- [ ] All environment variables configured
- [ ] Database migrations successful
- [ ] Custom domain working with HTTPS
- [ ] Stripe webhook receiving events
- [ ] Email sending successfully
- [ ] All authentication methods tested
- [ ] Complete booking flow tested end-to-end
- [ ] **Switch Stripe to Live Mode**
- [ ] Update Stripe keys to live keys
- [ ] Create production webhook in Stripe
- [ ] Update `STRIPE_WEBHOOK_SECRET`
- [ ] Final redeploy

## Maintenance

### Weekly Tasks
- Review deployment logs for errors
- Check database performance
- Monitor API usage costs

### Monthly Tasks
- Update dependencies: `npm outdated`
- Security audit: `npm audit`
- Review and rotate API keys if needed

## Support Resources

- **Railway:** https://railway.app/help
- **Stripe:** https://support.stripe.com
- **Supabase:** https://supabase.com/support
- **Resend:** support@resend.com
