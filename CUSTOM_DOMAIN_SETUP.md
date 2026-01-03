# Custom Domain Setup: erayawellnesstravels.com

## Overview

This guide will help you connect **erayawellnesstravels.com** to your Netlify deployment.

**Timeline**: 30 minutes setup + DNS propagation (1-48 hours, usually ~1 hour)

---

## Step 1: Deploy to Netlify First (Do This Now)

**Important**: Deploy your site to Netlify first with the default URL before adding the custom domain.

1. Complete the Netlify deployment form you're on
2. Add environment variables (see `NETLIFY_ENV_VARS.md`)
3. Deploy and get your Netlify URL: `https://[your-site].netlify.app`
4. Test that everything works on the Netlify URL

---

## Step 2: Add Custom Domain in Netlify

### 2.1 Navigate to Domain Settings
1. Go to your Netlify site dashboard
2. Click **Domain management** (or **Domain settings**)
3. Click **Add custom domain**

### 2.2 Add Your Domain
1. Enter: `erayawellnesstravels.com`
2. Netlify will check if you own it
3. Click **Verify** and then **Add domain**

### 2.3 Add WWW Subdomain (Recommended)
1. Click **Add domain alias**
2. Enter: `www.erayawellnesstravels.com`
3. This allows both `erayawellnesstravels.com` and `www.erayawellnesstravels.com` to work

---

## Step 3: Configure DNS Records

Netlify will show you which DNS records to add. You'll need to log into your domain registrar (where you bought the domain).

### Option A: Netlify DNS (Recommended - Easiest)

**Pros**: Automatic SSL, easy management, free
**Cons**: Needs to change nameservers

1. In Netlify, click **Set up Netlify DNS**
2. Netlify will show you 4 nameservers like:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
3. Go to your domain registrar's control panel
4. Find **Nameservers** or **DNS settings**
5. Replace existing nameservers with Netlify's nameservers
6. Save changes

**DNS propagation**: 1-48 hours (usually 1-2 hours)

### Option B: External DNS (Keep Current Registrar)

**Pros**: Keep existing DNS setup
**Cons**: Manual configuration required

Add these DNS records at your domain registrar:

#### For Root Domain (erayawellnesstravels.com):
```
Type: A
Name: @ (or leave blank)
Value: 75.2.60.5
TTL: 3600 (or 1 hour)
```

#### For WWW Subdomain (www.erayawellnesstravels.com):
```
Type: CNAME
Name: www
Value: [your-site].netlify.app
TTL: 3600
```

**Note**: Replace `[your-site]` with your actual Netlify site name.

---

## Step 4: Set Primary Domain

1. In Netlify → Domain management
2. Choose which should be primary:
   - `erayawellnesstravels.com` (recommended)
   - `www.erayawellnesstravels.com`
3. Click **Set as primary domain**
4. The other will automatically redirect to primary

**Recommendation**: Use `erayawellnesstravels.com` (without www) as primary.

---

## Step 5: Enable HTTPS (Automatic)

1. After DNS propagates, Netlify auto-provisions SSL certificate
2. This usually takes 1-5 minutes after DNS is verified
3. Check **Domain settings** → **HTTPS**
4. Should show: ✅ **Certificate active**

### Force HTTPS Redirect
1. In **HTTPS** section
2. Enable **Force HTTPS**
3. This redirects all HTTP traffic to HTTPS

---

## Step 6: Update Environment Variables

After the custom domain is working, update these in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Update:
   ```
   FRONTEND_URL=https://erayawellnesstravels.com
   ALLOWED_ORIGINS=https://erayawellnesstravels.com,https://www.erayawellnesstravels.com
   ```
3. Click **Save**
4. **Trigger a new deploy** for changes to take effect

---

## Step 7: Update Third-Party Services

### 7.1 Supabase OAuth
1. Go to Supabase Dashboard → **Auth** → **URL Configuration**
2. Update **Site URL**: `https://erayawellnesstravels.com`
3. Update **Redirect URLs**:
   - `https://erayawellnesstravels.com/**`
   - `https://www.erayawellnesstravels.com/**`

### 7.2 Google OAuth (If Using)
1. Go to Google Cloud Console → **Credentials**
2. Edit your OAuth 2.0 Client
3. **Keep existing** Supabase redirect, and add:
   - No changes needed (uses Supabase redirect)

### 7.3 Stripe Webhook
1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Edit your webhook endpoint
3. Update URL to: `https://erayawellnesstravels.com/api/stripe-webhook`
4. Copy the new webhook secret
5. Update `STRIPE_WEBHOOK_SECRET` in Netlify environment variables
6. **Redeploy** after updating

### 7.4 Resend Email (Optional)
1. Verify `erayawellnesstravels.com` in Resend dashboard
2. Add DNS records for email verification
3. Update `RESEND_FROM_EMAIL` to: `noreply@erayawellnesstravels.com`
4. Update Netlify environment variable and redeploy

---

## Step 8: Verification Checklist

After DNS propagates and updates are complete:

- [ ] Visit `https://erayawellnesstravels.com` - loads correctly
- [ ] Visit `http://erayawellnesstravels.com` - redirects to HTTPS
- [ ] Visit `www.erayawellnesstravels.com` - redirects to primary domain
- [ ] SSL certificate shows as valid (green padlock in browser)
- [ ] API endpoint works: `https://erayawellnesstravels.com/api/ping`
- [ ] Google OAuth login works
- [ ] Test booking and Stripe payment
- [ ] Contact form sends emails
- [ ] Admin panel accessible

---

## Troubleshooting

### Domain Not Resolving
- **Issue**: Site doesn't load on custom domain
- **Solution**: 
  - Check DNS records are correct
  - Use [DNS Checker](https://dnschecker.org) to verify propagation
  - Wait longer (can take up to 48 hours)

### SSL Certificate Not Provisioning
- **Issue**: "Not Secure" warning or SSL error
- **Solution**:
  - Ensure DNS is fully propagated
  - In Netlify → Domain settings → HTTPS → **Renew certificate**
  - Check CAA records don't block Let's Encrypt

### Mixed Content Warnings
- **Issue**: Some resources load over HTTP instead of HTTPS
- **Solution**:
  - Ensure all assets use HTTPS or relative URLs
  - Check browser console for mixed content errors

### OAuth Redirect Errors
- **Issue**: Google login fails after domain change
- **Solution**: 
  - Verify all redirect URLs updated in Supabase
  - Clear browser cache and cookies
  - Try incognito/private browsing

---

## DNS Propagation Timeline

**What happens after changing DNS:**

- **0-5 minutes**: Netlify detects changes
- **15-60 minutes**: Most of the world can access your site
- **4-8 hours**: 90% global propagation
- **24-48 hours**: 100% global propagation

**Check propagation**: https://dnschecker.org

---

## Current vs Final URLs

### Before Custom Domain:
- **Site**: `https://[your-site].netlify.app`
- **API**: `https://[your-site].netlify.app/api/*`

### After Custom Domain:
- **Site**: `https://erayawellnesstravels.com`
- **WWW**: `https://www.erayawellnesstravels.com` → redirects to main
- **API**: `https://erayawellnesstravels.com/api/*`

---

## Important Notes

> [!IMPORTANT]
> **Deploy and test on Netlify URL first** before adding custom domain. This ensures everything works before DNS changes.

> [!WARNING]
> **After adding custom domain**, you must update environment variables and redeploy, otherwise API calls will fail due to CORS.

> [!TIP]
> **Use Netlify DNS** if possible - it's the easiest option and Netlify handles everything automatically.

---

## Summary

1. ✅ Deploy to Netlify (get default URL working)
2. ✅ Add `erayawellnesstravels.com` in Netlify
3. ✅ Update DNS at registrar (or use Netlify DNS)
4. ✅ Wait for DNS propagation
5. ✅ Verify SSL is active
6. ✅ Update environment variables
7. ✅ Update OAuth and webhook URLs
8. ✅ Test everything

**Total time**: 30 min setup + 1-2 hours DNS wait

---

**Need help?** Check the main deployment guide or Netlify's [custom domain documentation](https://docs.netlify.com/domains-https/custom-domains/).
