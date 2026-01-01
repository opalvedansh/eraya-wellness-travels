# 🚀 Quick Setup: Fix "Error Sending Magic Link Email"

## The Problem
Your signup is using Supabase Auth, but Supabase doesn't have email (SMTP) configured yet.

## The Fix (5 minutes)

### Step 1: Get Your Resend SMTP Info
You already have a Resend API key. Use these credentials:
- **Host**: `smtp.resend.com`
- **Port**: `465` (or `587`)
- **Username**: `resend`
- **Password**: Your Resend API key (the one in your `.env`)

### Step 2: Configure Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (gear icon) → **Auth** → **SMTP Settings**
4. Toggle **Enable Custom SMTP** ON
5. Fill in:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`  
   - Password: `<paste your Resend API key here>`
   - Sender email: `onboarding@resend.dev` (for testing) or `noreply@yourdomain.com` (if domain verified)
   - Sender name: `Eraya Wellness Travels`
6. Click **Save**

### Step 3: Test It
1. Make sure dev server is running: `pnpm dev`
2. Go to signup page
3. Enter your email
4. Click "Create Account"
5. Check your email inbox (and spam!)

## That's It!

The error should be gone. Magic link emails will now be sent via Resend through Supabase.

---

**Need more details?** See [SUPABASE_EMAIL_SETUP.md](./SUPABASE_EMAIL_SETUP.md) for the complete guide.

**For production:** Verify your domain in Resend dashboard and update the sender email.
